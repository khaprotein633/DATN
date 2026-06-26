import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


export const getListQuestion = async (
  page = 1,
  limit = 10,
  subject_id = "",
  chapter_id = "",
  lesson_id = "",
  difficulty = "",
  knowledgeType = "",
  search = "",
) => {
  try {
    const response = await api.get("/question/list", {
      params: {
        page,
        limit,
        subject_id,
        chapter_id,
        lesson_id,
        difficulty,
        search,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Get question error:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Lỗi khi lấy danh sách câu hỏi");
  }
};

export const getAllQuestionBySubject = async (subject_id) => {
  try {
    const response = await api.get(`/question/subject/${subject_id}`);
    return response.data;
  } catch (error) {
    console.error("Get question error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy câu hỏi theo chương");
  }
};

export const addQuestion = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image") {
        if (data.image) {
          formData.append("image", data.image);
        }
      }
      else if (typeof data[key] === "object") {
        formData.append(key, JSON.stringify(data[key]));
      }
      else {
        formData.append(key, data[key]);
      }
    });
    const response = await api.post("/question/add",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("post question error:", error.response?.data || error.message);
    throw (error.response?.data || new Error("Lỗi khi thêm 1 câu hỏi"));
  }
};

// export const addQuestion = async (data) => {
//   try {
//     const response = await api.post(`/question/add/`, data);
//     return response.data;
//   } catch (error) {
//     console.error("post question error:", error.response?.data || error.message);
//     throw error.response?.data || new Error("Lỗi khi thêm 1 câu hỏi");
//   }
// };
// export const uploadImage = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append("image", file);
//     const response = await api.post("/question/upload-image",formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     return response.data;

//   } catch (error) {
//     console.error(
//       "upload image error:",
//       error.response?.data || error.message
//     );

//     throw (
//       error.response?.data ||
//       new Error("Lỗi khi tải ảnh lên cloudinary")
//     );
//   }
//};

export const updateQuestion = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "options" || key === "tags") {
        formData.append(
          key,
          JSON.stringify(data[key])
        );
      } else if (
        key === "image" &&
        data[key] instanceof File
      ) {
        formData.append("image", data[key]);
      } else {
        formData.append(
          key,
          data[key] ?? ""
        );
      }
    });
    const response = await api.put(
      "/question/update",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update question error:",
      error.response?.data ||
      error.message
    );
    throw (
      error.response?.data ||
      new Error(
        "Lỗi khi chỉnh sửa câu hỏi"
      )
    );

  }
};

// export const updateQuestion = async (data) => {
//   try {
//     const response = await api.put(`/question/update/`, data);
//     return response.data;
//   } catch (error) {
//     console.error("Update question error:", error.response?.data || error.message);
//     throw error.response?.data || new Error("Lỗi khi chỉnh sửa 1 câu hỏi");
//   }
// };

export const removeQuestion = async (id) => {
  try {
    const response = await api.delete(`/question/remove/${id}`);
    return response.data;
  } catch (error) {
    console.error("Remove question error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi xoá 1 câu hỏi");
  }
};

export const removeMultipleQuestion = async (ids) => {
  try {
    const res = await api.delete(
      "/question/remove/multiple",
      {
        data: { ids }
      }
    );

    return res.data;
  } catch (error) {
    console.error("Remove question error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi xoá 1 câu hỏi");
  }
};
export const importQuestionExcel = async (
  file,
  subject_id
) => {
  try {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "subject_id",
      subject_id
    );

    const response =
      await api.post(
        "/question/import-excel",
        formData
      );

    return response.data;

  } catch (error) {

    console.error(
      "Import question error:",
      error.response?.data ||
      error.message
    );

    throw (
      error.response?.data ||
      new Error(
        "Lỗi import câu hỏi"
      )
    );

  }
};


export const downloadQuestionTemplate = async (subject_id) => {
  try {
    const res = await api.get(
      `/question/template/${subject_id}`,
      {
        responseType: "blob",
      }
    );

    return res.data;

  } catch (error) {

    console.error(
      "Download template error:",
      error.response?.data ||
      error.message
    );

    throw (
      error.response?.data ||
      new Error("Lỗi tải file mẫu")
    );
  }
};

export const previewQuestionExcel = async (
  file,
  subject_id
) => {

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "subject_id",
    subject_id
  );

  const response = await api.post(
    "/question/import-preview",
    formData
  );

  return response.data;
};

