import { action, query, redirect } from "@solidjs/router";
import { getValidSession } from "../auth";

type Status = "public" | "private" | "trash";

// 提交到数据库的内容类型
interface StoreContentToDB {
  title: string;
  id: string;
  slug: string;
  summary: string | null;
  status: Status;
  jsonContent: object;
  htmlContent: string;
  user_id?: string; // 添加 user_id 字段
}

// 用户提交更新/创建时所提交的数据
interface PersistEditorActionProps {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: Status;
  jsonContent: object;
  htmlContent: string;
  user_id?: string; // 添加 user_id 字段
  submitAt: number; // 提交时间，用于判断是否需要更新，仅在action环节使用
}

// 写入数据表的数据结构
interface PersistArticleTable {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: Status;
  json_content: object;
  html_content: string;
  user_id: string; // 添加 user_id 字段
}

// 从数据库中读取数据的类型
interface ArticleTableGet {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: Status;
  json_content: object;
  html_content: string;
  user_id: string; // 添加 user_id 字段
  updated_at: string; // 更新时间
  created_at: string; // 创建时间
}

// ts中使用数据库中返回数据的类型，不暴露数据库的表结构。对应的是 ArticleTableGet
interface Article{
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: Status;
  jsonContent: object;
  htmlContent: string;
  user_id: string; // 添加 user_id 字段
  updatedAt: string; // 更新时间
  createdAt: string; // 创建时间
}

// 数据写入数据库的action
const persistEditorAction = action(async (props: PersistEditorActionProps) => {
  "use server";

  try {
    // 检查环境变量
    const apiKey = process.env.SUPABASE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    if (!apiKey || !supabaseUrl) {
      console.error("环境变量缺失:", {
        apiKey: !!apiKey,
        supabaseUrl: !!supabaseUrl,
      });
      throw new Error("环境变量SUPABASE_KEY或SUPABASE_URL未配置");
    }

    const baseUrl = supabaseUrl + "/rest/v1/articles";
    console.log("API URL:", baseUrl);

    // 会话验证
    const localSession = await getValidSession();
    if (!localSession?.session) {
      console.error("无效的会话");
      throw redirect("/signin");
    }

    const accessToken = localSession.session.access_token;
    const userId = localSession.session.user.id;

    console.log("认证信息:", { userId, hasAccessToken: !!accessToken });

    // 准备存储数据，包含用户ID
    const postData: PersistArticleTable = {
      title: props.title,
      id: props.id,
      slug: props.slug,
      summary: props.summary,
      status: props.status,
      json_content: props.jsonContent,
      html_content: props.htmlContent,
      user_id: userId, // 设置用户ID
    };

    console.log("要保存的数据:", {
      id: postData.id,
      title: postData.title,
      slug: postData.slug,
      status: postData.status,
      user_id: postData.user_id,
    });

    // 1. 首先尝试直接获取文章，而不是用HEAD
    console.log("检查文章是否存在:", `${baseUrl}?id=eq.${props.id}`);
    const checkResponse = await fetch(
      `${baseUrl}?id=eq.${props.id}&select=id`,
      {
        method: "GET", // 使用GET代替HEAD以获取实际数据
        headers: {
          apikey: apiKey as string,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("检查响应状态:", checkResponse.status, checkResponse.ok);

    let checkData = [];
    try {
      checkData = await checkResponse.json();
      console.log("检查结果:", checkData);
    } catch (e) {
      console.error("解析检查结果时出错:", e);
    }

    let method = "POST";
    let endpoint = baseUrl;

    // 2. 通过实际检查响应内容来确定文章是否存在
    if (checkResponse.ok && Array.isArray(checkData) && checkData.length > 0) {
      method = "PATCH";
      endpoint = `${baseUrl}?id=eq.${props.id}`;
      console.log("文章已存在，使用PATCH更新");
    } else {
      console.log("文章不存在，使用POST创建");
    }

    // 3. 始终使用详细响应，方便调试
    const preferHeader = "return=representation";

    // 发送请求到 Supabase
    console.log("发送请求:", { method, endpoint });
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        apikey: apiKey as string,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: preferHeader,
      },
      body: JSON.stringify(postData),
    });

    console.log("保存响应状态:", response.status, response.ok);

    // 尝试获取响应内容
    let responseData = null;
    try {
      const responseText = await response.text();
      console.log("响应原始内容:", responseText);

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
          console.log("响应解析内容:", responseData);
        } catch (parseError) {
          console.log("响应不是有效的JSON");
        }
      }
    } catch (e) {
      console.log("无法读取响应内容");
    }

    if (!response.ok) {
      console.error("保存失败, 状态码:", response.status);
      throw new Error(
        `Database operation failed with status ${response.status}: ${response.statusText}`
      );
    }

    // 4. 保存后再次验证数据是否存在
    const verifyResponse = await fetch(`${baseUrl}?id=eq.${props.id}`, {
      headers: {
        apikey: apiKey as string,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = await verifyResponse.json();
    console.log("验证保存后的数据:", verifyData);

    console.log(
      `Article ${method === "POST" ? "created" : "updated"} successfully`
    );
    return { success: true, id: props.id };
  } catch (error) {
    console.error("Error saving article:", error);
    throw new Error(`Failed to save article to database: ${error}`);
  }
});

// 读取数据的query
const getArticle = query(async (slug: string) => {
  "use server";

  try {
    const apiKey = process.env.SUPABASE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    if (!apiKey || !supabaseUrl) {
      console.error("环境变量缺失:", {
        apiKey: !!apiKey,
        supabaseUrl: !!supabaseUrl,
      });
      throw new Error("环境变量SUPABASE_KEY或SUPABASE_URL未配置");
    }

    const baseUrl = supabaseUrl + "/rest/v1/articles";
    const response = await fetch(`${baseUrl}?slug=eq.${slug}`, {
      headers: {
        apikey: apiKey as string,
        // Authorization: `Bearer ${getValidSession()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching article: ${response.statusText}`);
    }

    const data: ArticleTableGet[] = await response.json();
    const article: Article = {
      id: data[0].id,
      title: data[0].title,
      slug: data[0].slug,
      summary: data[0].summary,
      status: data[0].status,
      jsonContent: data[0].json_content,
      htmlContent: data[0].html_content,
      user_id: data[0].user_id,
      updatedAt: data[0].updated_at,
      createdAt: data[0].created_at,
    }
    console.log("获取的文章数据:", article);
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw new Error(`Failed to fetch article from database: ${error}`);
  }
}, "getArticle");

export {
  persistEditorAction,
  getArticle,
  type ArticleTableGet,
  type PersistEditorActionProps,
  type StoreContentToDB,
};
