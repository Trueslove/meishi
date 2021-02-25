<template>
    <div class="list">
      <div v-for="(item, index) in dataItem" :key="index" class="list-item">
        <van-card
          :price="item.money"
          :desc="item.foodDescription"
          :title="item.foodName"
          :thumb="item.picture"
        >
          <template #tags>
            <van-tag plain type="danger">{{
              item.createTime
            }}</van-tag>
          </template>
          <template #footer>
            <van-button size="mini" type="warning" v-if="item.evaluate == 1">已评价</van-button>
            <van-button size="mini" type="primary" v-if="item.evaluate == 2" @click="handleToDetailPage(item.id)">去评价</van-button>
          </template>
        </van-card>
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
      this.getListData();
    },
    methods: {
      getListData() {
        axios.get("/authc/api/recharge/find_order", 
          {
            headers: {
            'Authorization': JSON.parse(sessionStorage.getItem("userInfo")).token
          }
        }).then((res) => {
          if(res.data.code == 0 && !!res.data.data) {
            this.dataItem = res.data.data
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
          path: '/business',
          query: {
            id
          }
        })
      }
    }
}
</script>
<style lang="less">
.list {
  background: #fff;
}
.list-item {
  padding: 0.2rem 0.3rem 0;
}
</style>