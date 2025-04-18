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
    <div v-else class="type-selector">
      <p>无法自动识别文件类型，请手动选择：</p>
      <select v-model="selectedType">
        <option value="word">Word (.docx)</option>
        <option value="excel">Excel (.xlsx)</option>
        <option value="powerpoint">PowerPoint (.pptx)</option>
        <option value="pdf">PDF (.pdf)</option>
      </select>
      <button @click="confirmType">确认</button>
    </div>
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
const showTypeSelector = ref(false);
const selectedType = ref("");

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
  const supportedTypes = {
    docx: "word",
    xlsx: "excel",
    pptx: "powerpoint",
    pdf: "pdf"
  };
  
  if (ext in supportedTypes) {
    fileType.value = supportedTypes[ext];
  } else {
    showTypeSelector.value = true;
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

const confirmType = () => {
  fileType.value = selectedType.value;
  showTypeSelector.value = false;
};
</script>

<style scoped>
.type-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
}

.type-selector p {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.type-selector select {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 16px;
  min-width: 200px;
}

.type-selector button {
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.type-selector button:hover {
  background-color: #40a9ff;
}
</style>
