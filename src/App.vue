<template>
  <div v-loading="loading">
    <vue-office-docx
      v-if="fileType === 'word'"
      :src="fileUrl"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
    <vue-office-excel
      v-else-if="fileType === 'excel'"
      :src="fileUrl"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
    <vue-office-pptx
      v-else-if="fileType === 'powerpoint'"
      :src="fileUrl"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
    <vue-office-pdf
      v-else-if="fileType === 'pdf'"
      :src="fileUrl"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
    <div v-else class="unsupported-message">不支持的文件格式</div>
  </div>
</template>

<script setup>
// 引入VueOfficeDocx组件
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";
import VueOfficePptx from "@vue-office/pptx";
import VueOfficePdf from "@vue-office/pdf";

// 引入相关样式
import "@vue-office/docx/lib/index.css";
import "@vue-office/excel/lib/index.css";
import { ref } from "vue";

// 使用ref创建响应式数据
const loading = ref(true);
const fileUrl = ref("");
const fileType = ref("");

// 从URL参数获取文件地址
const urlParams = new URLSearchParams(window.location.search);
const fileParam = urlParams.get("file");
console.log("fileParam: ", fileParam);
if (fileParam) {
  const url = new URL(fileParam);
  console.log("url: ", url);
  fileUrl.value = url.href;
  const fileName = decodeURIComponent(url.pathname.split("/").pop());
  console.log("fileName: ", fileName);
  const ext = fileName.split(".").pop().toLowerCase();
  console.log("ext: ", ext);
  if (["docx"].includes(ext)) {
    fileType.value = "word";
  } else if (["xlsx"].includes(ext)) {
    fileType.value = "excel";
  } else if (["pptx"].includes(ext)) {
    fileType.value = "powerpoint";
  }
  if (ext === "pdf") {
    fileType.value = "pdf";
  }
}

// 定义处理函数
const renderedHandler = () => {
  loading.value = false;
  console.log("渲染完成");
};

const errorHandler = () => {
  loading.value = false;
  console.log("渲染失败");
};
</script>

<style scoped>
.unsupported-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: red;
}
</style>
