<template>
  <div class="detail">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <van-image
          :src="detailData.picture"
        />
      </van-swipe-item>
    </van-swipe>
    <van-tabs >
      <van-tab title="详情">
        <van-cell-group>
          <van-cell title="美食名称" :value="detailData.foodName" />
          <van-cell title="美食简介" :value="detailData.foodDescription" />
          <van-cell title="美食价格" :value="'￥' + detailData.money" />
          <van-cell title="美食类型" :value="detailData.foodTypeName" />
          <van-cell title="好评数量" :value="detailData.highPraise" />
          <van-cell title="地址" :value="detailData.address" />
        </van-cell-group>
        <div class="detail-btn" @click="handleToBuy">
          <van-button type="primary" block>
            立即下单
          </van-button>
        </div>
      </van-tab>
      <van-tab title="评论">
        <!-- <div class="detail-pl" v-if="detailData.highPraise != 0">{{detailData.highPraise}}</div> -->
        <van-empty v-if="plItem.length == 0" description="暂无评论" />
        <div v-for="(item, index) in plItem" :key="index" class="detail-item">
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
                <span style="flex:1">{{item.nickName}}</span>
                <span>{{item.createTime}}</span>
              </span>
              <div>
                <van-rate :size="15" v-model="item.parseChange" readonly />
              </div>
            </div>
          </div>
          <div class="detail-content">
            <p class="detail-content-p">{{item.content}}</p>
            <van-grid :border="false" :column-num="3">
              <van-grid-item v-for="(item1, index) in item.pictureArr" :key="index">
                <van-image :src="item1" />
              </van-grid-item>
            </van-grid>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <div class="detail-share" @click="handleSharePage">
      分享
    </div>
    <div class="detail-share detail-home" @click="handleHomePage">
      首页
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      id: '',
      userInfo: {},
      detailData: {},
      plItem: []
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.getDetail();
    this.getPList();
  },
  methods: {
    handleHomePage() {
      this.$router.push('/')
    },
    onSelect(option) {
      Toast(option.name);
      this.showShare = false;
    },
    handleToBuy() {
      axios.post("/authc/api/recharge/place_order", 
        {
          foodId: this.detailData.id,
          money: this.detailData.money
        },
        {
          headers: {
            'Authorization': this.userInfo.token
          }
        }).then((res) => {
          if(res.data.code == 0) {
            this.$toast('下单成功');
          } else {
            this.$toast(res.data.resultNote);
          }
        }).catch((error) => {
          console.warn(error)
        })
    },
    // 查看评论列表
    getPList() {
      axios.get("/authc/api/business/find_user_eval", 
        {
          params: {id: this.id},
          headers: {
            'Authorization': this.userInfo.token
          }
        }).then((res) => {
          if(res.data.code == 0 && res.data.data) {
            this.plItem = res.data.data
            this.plItem.forEach(item => {
              item.pictureArr = item.picture.split(';')
              if(item.praise == 1) {
                item.parseChange = 5
              } else if (item.praise == 2) {
                item.parseChange = 3
              } else {
                item.parseChange = 1
              }
            }) 
          }
        }).catch((error) => {
          console.warn(error)
        })
    },
    // 查看详情数据
    getDetail() {
      axios.get("/authc/api/business/query_food_by_id", 
        {
          params: {id: this.id},
          headers: {
            'Authorization': this.userInfo.token
          }
        }).then((res) => {
          if(res.data.code == 0) {
            this.detailData = res.data.data
          }
        }).catch((error) => {
          console.warn(error)
        })
    },
    handleSharePage() {
      this.$router.push({path: '/share', query: {
        id: this.detailData.id
      }})
    }
  }
};
</script>
<style lang="less">
.detail {
  .detail-item {
    padding: 0.1rem 0.3rem;
  }
   .detail-share {
    position: fixed;
    top: 30%;
    right: 0;
    width: 1rem;
    height: 0.6rem;
    line-height:0.6rem;
    background:coral;
    border-radius: 0.3rem 0 0 0.3rem;
    text-align: center;
    color: #fff;
    z-index: 12;
  }
  .detail-home {
    top: 70%;
    height: 1rem;
    line-height: 1rem;
    border-radius: 50%;
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
   .my-swipe .van-swipe-item {
    line-height: 4.5rem;
    text-align: center;
    background-color: #39a9ed;
  }
  .van-image {
    display: block;
  }
  .detail-pl {
    padding: 0.3rem 0.5rem;
  }
  .detail-btn {
    position: fixed;
    margin: auto;
    bottom: 0.1rem;
    left: 2%;
    width: 96%;
  }
}
</style>

