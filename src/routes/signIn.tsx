import { createSignal, Show, createEffect } from "solid-js";
import { useAction, useSubmission } from "@solidjs/router";
import { signInWithOtp, verifyOtp } from "~/lib/auth/actions";

export default function SignIn() {
  const signInSubmission = useSubmission(signInWithOtp);
  const verifyOtpAction = useAction(verifyOtp);
  const verifyOtpSubmission = useSubmission(verifyOtp);

  // 状态变量
  const [currentStep, setCurrentStep] = createSignal<"email" | "otp">("email");
  const [email, setEmail] = createSignal<string>("");
  const [otpValues, setOtpValues] = createSignal<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);

  let otpRefs: (HTMLInputElement | null)[] = [null, null, null, null, null, null];

  // 监听表单提交状态变化
  createEffect(() => {
    // 当提交完成且之前是提交状态时
    if (isSubmitting() && !signInSubmission.pending && signInSubmission.result) {
      setIsSubmitting(false);
      handleEmailSubmitSuccess();
    }
  });

  // 更新邮箱地址
  const handleEmailChange = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    setEmail(e.currentTarget.value);
  };
  
  // 处理邮箱表单提交成功
  const handleEmailSubmitSuccess = () => {
    setCurrentStep("otp");
    // 聚焦第一个OTP输入框
    setTimeout(() => {
      if (otpRefs[0]) otpRefs[0].focus();
    }, 100);
  };

  // 处理OTP输入
  const handleOtpInput = (index: number, value: string) => {
    // 只允许数字
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otpValues()];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // 当前输入填写后移动到下一个输入框
    if (value && index < 5) {
      otpRefs[index + 1]?.focus();
    }

    // 全部填写后自动提交
    if (newOtp.every((digit) => digit !== "")) {
      setTimeout(() => submitOtp(), 100);
    }
  };

  // 处理粘贴OTP
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text/plain');
    
    if (!pastedText) return;
    
    // 提取数字
    const digits = pastedText.replace(/\D/g, '').slice(0, 6).split('');
    
    // 填充OTP输入框
    const newOtp = [...otpValues()];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    
    setOtpValues(newOtp);
    
    // 如果粘贴的内容填满了所有输入框，则提交
    if (digits.length === 6) {
      setTimeout(() => submitOtp(), 100);
    } else if (digits.length < 6) {
      // 聚焦到第一个空输入框
      const emptyIndex = newOtp.findIndex(val => val === '');
      if (emptyIndex >= 0 && otpRefs[emptyIndex]) {
        otpRefs[emptyIndex].focus();
      }
    }
  };

  // 处理OTP提交
  const submitOtp = () => {
    const otp = otpValues().join("");
    verifyOtpAction(email(), otp);
  };

  // 处理OTP输入框的键盘按键
  const handleOtpKeyDown = (index: number, e: KeyboardEvent) => {
    // 按退格键且当前输入为空时移动到前一个输入框
    if (e.key === "Backspace" && !otpValues()[index] && index > 0) {
      otpRefs[index - 1]?.focus();
    }
  };

  return (
    <main class="flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md">
        <Show when={currentStep() === "email"}>
          <h2 class="text-xl font-semibold mb-4 text-center">邮箱登录</h2>
          <form
            method="post"
            action={signInWithOtp}
            onSubmit={(e) => {
              // 防止表单默认提交行为
              if (!email() || !/^\S+@\S+\.\S+$/.test(email())) {
                e.preventDefault();
                return;
              }
              setIsSubmitting(true);
            }}
            class="w-full"
          >
            <div class="flex flex-col md:flex-row gap-3">
              <input
                name="email"
                type="email"
                value={email()}
                onInput={handleEmailChange}
                class="w-full px-4 py-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="请输入邮箱地址"
                required
              />
              <button
                type="submit"
                disabled={signInSubmission.pending || isSubmitting()}
                class="w-full md:w-auto whitespace-nowrap px-6 py-2 bg-sky-600 text-white rounded hover:bg-gray-200 hover:text-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signInSubmission.pending ? "发送中..." : "获取验证码"}
              </button>
            </div>
          </form>
        </Show>

        <Show when={currentStep() === "otp"}>
          <h2 class="text-xl font-semibold mb-2 text-center">输入验证码</h2>
          <p class="text-center mb-4 text-gray-600">验证码已发送至 {email()}</p>
          
          <Show when={!verifyOtpSubmission.pending} fallback={
            <div class="flex flex-col items-center gap-4 my-8">
              <div class="w-12 h-12 border-t-4 border-sky-500 border-solid rounded-full animate-spin"></div>
              <p class="text-center text-gray-600">正在验证...</p>
            </div>
          }>
            <div 
              class="flex justify-center gap-2 mb-4" 
              onPaste={handlePaste}
            >
              {otpValues().map((value, index) => (
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onInput={(e) => handleOtpInput(index, e.currentTarget.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpRefs[index] = el)}
                  class="w-12 h-12 text-center text-xl border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  disabled={verifyOtpSubmission.pending}
                />
              ))}
            </div>
            <div class="text-center">
              <button
                onClick={() => setCurrentStep("email")}
                class="text-sky-600 hover:underline"
                disabled={verifyOtpSubmission.pending}
              >
                重新发送验证码
              </button>
            </div>
          </Show>
        </Show>
      </div>
    </main>
  );
}
