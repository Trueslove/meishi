<template>
    <div class="list">
     <van-empty v-if="dataItem.length == 0" description="暂无评论" />
      <div v-for="(item, index) in dataItem" :key="index" class="detail-item">
        <div class="detail-top">
          <div class="detail-t-l">
            <van-image
              round
              width="1rem"
              height="1rem"
              :src="item.headImg"
            />
          </div>
          <div class="detail-t-r">
            <span class="detail-name">
              <span style="flex:1">{{item.userName}}</span>
              <span>{{item.createTime}}</span>
            </span>
          </div>
        </div>
        <div class="detail-content">
          <p class="detail-content-p">{{item.content}}</p>
          <van-grid :border="false" :column-num="3">
            <van-grid-item v-for="(item1, index) in item.imgArr" :key="index">
              <van-image :src="item1" />
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'list',
    data() {
      return {
        dataItem: []
      }
    },
    created() {
      this.getPList();
    },
    methods: {
      // 查看评论列表
      getPList() {
        axios.get("/pub/api/user/find_share", 
          {
            headers: {
              'Authorization': JSON.parse(sessionStorage.getItem("userInfo"))
            }
          }).then((res) => {
            if(res.data.code == 0 && res.data.data) {
              this.dataItem = res.data.data
              this.dataItem.forEach(item => {
                item.imgArr = item.img.split(';')
              })
            } else {
              this.dataItem = []
            }
          }).catch((error) => {
            console.warn(error)
          })
      },
      // 跳转详情页
      handleToDetailPage(id) {
        this.$router.push({
          path: '/detail',
          query: {
            id
          }
        })
      }
    }
}
</script>
<style  lang="less">
.detail-item {
    padding: 0.1rem 0.3rem;
    border-bottom: 0.01rem solid #f5f5f5;
  }
  .detail-content-p {
    padding: 0.4rem 0.4rem 0.2rem 1.4rem;
    font-size: 0.3rem;
  }
  .detail-top {
    display: flex;
    align-items: center;
  }
  .detail-t-l {
    display: flex;
    justify-content: space-between;
  }
  .detail-t-r {
    margin-left: 0.5rem;
    flex: 1;
  }
  .detail-name {
    display: flex;
    justify-content: space-between;
  }
</style>