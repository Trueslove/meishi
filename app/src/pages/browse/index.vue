<template>
  <div class="myself">
    <div v-for="(item, index) in listItem" :key="index" class="myself-item">
      <div class="myself-left">
        <van-image
          width="50"
          height="50"
          src="https://pics4.baidu.com/feed/472309f7905298223119528a23d3d2cd0a46d475.jpeg?token=8ebdbfa15f5d6d0ef73b217e7835dd5b"
        />
      </div>
      <div class="myself-right">
        <h3>内容</h3>
        <van-grid :border="false" :column-num="3">
          <van-grid-item @click="handlePickImg">
            <van-image src="https://img01.yzcdn.cn/vant/apple-1.jpg" />
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <van-image-preview v-model="show" :images="images" @change="onChange">
      <template v-slot:index>第{{ index }}页</template>
    </van-image-preview>
    <div class="detail-share" @click="handleSharePage">
        发 布
    </div>
  </div>
</template>
<script>
export default {
  name: "myself",
  data() {
    return {
      listItem: [
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" },
        { url: "./../../assets/logo.png", title: "我的消息" }
      ],
      show: false,
      index: 0,
      images: [
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
      ]
    };
  },
  methods: {
    onChange(index) {
      this.index = index;
    },
    handleSharePage() {
      this.$router.push({path: '/share'})
    }
  }
};
</script>
<style lang="less">
.myself {
  margin-top: 0.5rem 0 1rem;
}
.myself-item {
  display: flex;
  justify-content: left;
  padding: 0.2rem 0.4rem;
  border-bottom: 1PX solid #cecece;
}
.myself-left {
  margin-right: 0.2rem;
}
 .detail-share {
    position: fixed;
    top: 80%;
    right: 0.2rem;
    width: 1rem;
    height: 1rem;
    line-height:1rem;
    background:coral;
    border-radius: 50%;
    text-align: center;
    color: #fff;
  }
  .myself-deal {
    height: 263 / @r;
  }
  .myself-set {
    height: 263 / @r;
  }
  .myself-btn {
    margin: 20 / @r auto 142 / @r;
  }
</style>
