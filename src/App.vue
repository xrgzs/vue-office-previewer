<template>
  <div v-loading="loading">
    <component v-if="fileType" :is="loadComponent(fileType)" :src="fileUrl" style="height: 100vh"
      @rendered="renderedHandler" @error="errorHandler" />
    <div v-else-if="showTypeSelector" class="type-selector">
      <p>无法自动识别文件类型，请手动选择：</p>
      <select v-model="selectedType">
        <option value="word">Word (.docx)</option>
        <option value="excel">Excel (.xlsx)</option>
        <option value="powerpoint">PowerPoint (.pptx)</option>
        <option value="pdf">PDF (.pdf)</option>
      </select>
      <button @click="confirmType">确认</button>
    </div>
    <div v-else class="unsupported-message">不支持的文件格式</div>
  </div>
</template>

<script setup>
// 动态导入组件
import { defineAsyncComponent, ref } from "vue";

// 动态加载组件函数
const componentCache = {};
const loadComponent = (type) => {
  if (!componentCache[type]) {
    switch (type) {
      case 'word':
        componentCache[type] = defineAsyncComponent(() => import('@vue-office/docx'));
        break;
      case 'excel':
        componentCache[type] = defineAsyncComponent(() => import('@vue-office/excel'));
        break;
      case 'powerpoint':
        componentCache[type] = defineAsyncComponent(() => import('@vue-office/pptx'));
        break;
      case 'pdf':
        componentCache[type] = defineAsyncComponent(() => import('@vue-office/pdf'));
        break;
    }
  }
  return componentCache[type];
};

// 使用ref创建响应式数据
const loading = ref(true);
const fileUrl = ref("");
const fileType = ref("");
const showTypeSelector = ref(false);
const selectedType = ref("");

// 从URL参数获取文件地址
const urlParams = new URLSearchParams(window.location.search);
const fileParam = urlParams.get("file");
let fileName = urlParams.get("name");
console.log("fileParam: ", fileParam);
if (fileParam) {
  const url = new URL(fileParam);
  console.log("url: ", url);
  fileUrl.value = url.href;
  if (!fileName) {
    fileName = decodeURIComponent(url.pathname.split("/").pop());
  }
  console.log("fileName: ", fileName);
  const ext = fileName.split(".").pop().toLowerCase();
  console.log("ext: ", ext);
  if (["docx"].includes(ext)) {
    fileType.value = "word";
    import('@vue-office/docx/lib/index.css');
  } else if (["xlsx"].includes(ext)) {
    fileType.value = "excel";
    import('@vue-office/excel/lib/index.css');
  } else if (["pptx"].includes(ext)) {
    fileType.value = "powerpoint";
  } else if (["pdf"].includes(ext)) {
    fileType.value = "pdf";
  } else if (["doc", "xls", "ppt"].includes(ext)) {
    // 不支持
    fileType.value = "";
    showTypeSelector.value = false;
  } else {
    // 显示选择器
    showTypeSelector.value = true;
  }
}

// 定义处理函数
const renderedHandler = () => {
  loading.value = false;
  console.log("渲染完成");
};

const errorHandler = (error) => {
  loading.value = false;
  console.error("渲染失败:", error);
  alert(`文件渲染失败: ${error.message || '未知错误'}`);
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

.unsupported-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #ff4d4f;
  background-color: #fff2f0;
}
</style>
