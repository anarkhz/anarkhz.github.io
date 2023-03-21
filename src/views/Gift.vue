<template>
  <div class="gift">
    <img
      v-if="currentGift"
      :src="currentGift.pic"
      height="300"
      :style="{
        display: 'block',
        margin: '120px auto 12px',
        filter: 'blur(10px)',
      }"
    />
    <video
      v-else
      muted="muted"
      class="H5VideoPlayer"
      controlslist="nodownload"
      src="../assets/gift.mp4"
      autoplay="autoplay"
      loop=""
      width="300"
      height="300"
      @click="visibleBinding = true"
      :style="{ marginTop: '120px' }"
    ></video>
    <div class="footer">
      <el-button @click="handlePreOpen" type="danger" plain>{{
        currentGift ? "再次打开" : "打开礼物"
      }}</el-button>
      <div class="divider" :style="{ marginTop: '12px' }"></div>
      <el-button @click="visibleBinding = true">修改参数</el-button>
    </div>

    <el-drawer
      v-model="visibleBinding"
      title="自定义礼物参数"
      direction="ltr"
      size="100%"
    >
      <el-divider content-position="left">选择一个/多个种类</el-divider>
      <el-checkbox-group
        :style="{ marginBottom: '48px', textAlign: 'left' }"
        v-model="categoryPicked"
      >
        <el-checkbox
          v-for="(item, index) in Categories"
          :key="'category-' + index"
          :label="item"
          :value="index"
        />
      </el-checkbox-group>

      <el-divider content-position="left">选择一个/多个喜欢的颜色</el-divider>
      <el-checkbox-group
        :style="{ marginBottom: '48px', textAlign: 'left' }"
        v-model="colorPicked"
      >
        <el-checkbox
          v-for="(item, index) in colorPool"
          :key="'color-' + index"
          :label="item"
          :value="index"
        />
        <div class="toolsBar" :style="{ textAlign: 'right' }">
          <el-button
            @click="refreshColorPool"
            type="primary"
            text
            bg
            size="small"
            >换一批</el-button
          >
        </div>
      </el-checkbox-group>

      <el-divider content-position="left">选择一个/多个关键词</el-divider>
      <el-checkbox-group
        :style="{ marginBottom: '48px', textAlign: 'left' }"
        v-model="keywordPicked"
      >
        <el-checkbox
          v-for="(item, index) in keywordPool"
          :key="'keyword-' + index"
          :label="item"
          :value="index"
        />
        <div class="toolsBar" :style="{ textAlign: 'right' }">
          <el-button
            @click="refreshKeywordPool"
            type="primary"
            text
            bg
            size="small"
            >换一批</el-button
          >
        </div>
      </el-checkbox-group>

      <el-button
        type="primary"
        :style="{ width: '80%' }"
        @click="handleOpenGift"
        >打开礼物</el-button
      >
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import _ from "lodash";
import { reactive, ref } from "vue";
import {
  ElButton,
  ElDrawer,
  ElCheckboxGroup,
  ElCheckbox,
  ElDivider,
  ElMessage,
} from "element-plus";
import { Categories, Colors, Keywords, Gifts } from "@/gifts";
import { randomExtraction } from "@/utils/index";

const currentGift: any = ref(null);

const visibleBinding = ref(false);

const colorPool = ref(randomExtraction(Colors, 10));
const keywordPool = ref(randomExtraction(Keywords, 10));

const categoryPicked = ref([]);
const colorPicked = ref([]);
const keywordPicked = ref([]);

const handlePickGift = () => {
  const myGifts = _.cloneDeep(Gifts);
  // const myGifts = _.cloneDeep(
  //   Gifts.filter((item) => categoryPicked.value.includes(item.category))
  // );

  myGifts.forEach((item) => {
    if (categoryPicked.value.includes(item.category)) {
      item.weight++;
    }
    item.color.forEach((giftColor) => {
      if (colorPicked.value.includes(giftColor)) {
        item.weight++;
      }
    });
    item.keywords.forEach((giftKeyword) => {
      if (keywordPicked.value.includes(giftKeyword)) {
        item.weight++;
      }
    });
  });

  // 筛选礼物
  function screenGift(giftList) {
    const screenList: any = [];
    giftList.forEach((item) => {
      if (item.weight > 0) {
        screenList.push(...new Array(item.weight).fill(item));
      }
    });
    // 打乱顺序
    screenList.sort(() => Math.random() - 0.5);

    // 随机挑选一个
    const sign = Math.floor(Math.random() * screenList.length);

    const result = screenList[sign];

    console.log("------------ 奖池 ------------");
    console.log(giftList);
    console.log(screenList);
    console.log("------------ 奖品 ------------");
    console.log(result);
    return result;
  }

  const giftPicked = screenGift(myGifts);

  return giftPicked;
};

const handlePreOpen = () => {
  if (!currentGift.value) {
    visibleBinding.value = true;
  } else {
    handleOpenGift();
  }
};

const handleOpenGift = () => {
  if (categoryPicked.value.length > 0) {
    currentGift.value = handlePickGift();
    // console.log(currentGift);
    if (visibleBinding.value) visibleBinding.value = false;
  } else {
    if (!visibleBinding.value) visibleBinding.value = true;
    ElMessage({
      type: "warning",
      message: "请至少选择一个种类",
      zIndex: 9999,
    });
  }
};

const refreshColorPool = () => {
  colorPool.value = randomExtraction(Colors, 10);
};

const refreshKeywordPool = () => {
  keywordPool.value = randomExtraction(Colors, 10);
};

// const handleClose = (done: () => void) => {
//   done();
// };
</script>
