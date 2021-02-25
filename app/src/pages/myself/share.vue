<template>
  <div class="myself">
    <van-form validate-first  @submit="onSubmit">
      <!-- 通过 pattern 进行正则校验 -->
      <van-field
        v-model="content"
        name="pattern"
        placeholder="发布内容"
        label="内容"
      />
     <van-field name="uploader" label="图片">
        <template #input>
          <van-uploader :max-count="9" v-model="uploader" />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">发 布</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: "myself",
  data() {
    return {
      content: '',
      uploader: []
    }
  },
  methods: {
    onSubmit() {
      let imgArr = []
      this.uploader.forEach(item => {
        let content = item.file;
        let data = new FormData();
        // FormData 对象的使用：
        // 1.用一些键值对来模拟一系列表单控件：即把form中所有表单元素的name与value组装成一个queryString
        // 2. 异步上传二进制文件。
        //上传图片需要转换二进制这里要用到FormData
        
        data.append('file',content);
        axios.post("/authc/api/video/upload", data,{
            headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('userInfo')).token
          }
        }).then((res) => {
          imgArr.push(res.data.data)
        }).catch((error) => {
          console.warn(error)
        })
      })
      setTimeout(() =>{
        console.log(this.$route.id)
        axios.post("/authc/api/business/save_share", 
          {
            content: this.content,
            img: imgArr.join(";"),
            foodId: this.$route.query.id
          },{
            headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('userInfo')).token
          }
        }).then((res) => {
          if(res.data.code == 0) {
            this.$toast('分享成功')
            this.$router.push({path: '/list'})
          } else {
            this.$toast('分享失败，请联系管理员')
          }
        }).catch((error) => {
          console.warn(error)
        })
      }, 1000)      
    }
  }
};
</script>
<style lang="less">
.myself {
  margin-top: 0.5rem;
}

</style>
