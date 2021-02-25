<template>
    <div class="home">
      <div class="home-search">
        <van-search
          v-model="foodName"
          shape="round"
          background="#4fc08d"
          placeholder="请输入搜索关键词"
          @search="onSearch"
        />
      </div>
     <div class="home-content">
      <van-dropdown-menu>
        <van-dropdown-item :title="dropdownTitle" ref="item">
          <div class="home-all-city" @click="handleAllCity">全部城市</div>
          <van-area :area-list="areaList" @confirm="onConfirm" :value="cityValue" @change="changearea"/>
        </van-dropdown-item>
        <van-dropdown-item v-model="foodTypeId" @change="getDataItem" :options="typeOption" />
        <van-dropdown-item v-model="km" @change="getDataItem" :options="juliOption" />
      </van-dropdown-menu>
      <div v-for="(item, index) in dataItem" :key="index" @click="handleToDetailPage(item.id)">
        <van-card
          :desc="item.address"
          :title="item.foodName"
          :thumb="item.picture"
        />
      </div>
      <van-empty v-if="dataItem.length == 0" description="该城市暂无相关推荐" />
     </div>
    </div>
</template>
<script>
import axios from 'axios'
import map from '../../assets/map'
import province_list from '../../assets/area'
export default {
  name: "home",
  data() {
    return {
      province: '',
      city: '',
      country: '',
      foodName: '',
      dataItem: [],
      cityValue: '',
      saveChangeArea: [
        {name: '北京市'}, {name: '北京市'}, {name: '中城区'}
      ],
      dropdownTitle: '全部城市',
      juliOption: [
        { text: '全部距离', value: '' },
        { text: '500m', value: 0.5 },
        { text: '1KM', value: 1 },
        { text: '2KM', value: 2 },
        { text: '3KM', value: 3 },
        { text: '5KM', value: 5 },
      ],
      typeOption: [],
      foodTypeId: '',
      km: '',
      areaList: province_list
    };
  },
  methods: {
    // 搜索
    onSearch() {
      this.getDataItem();
    },
    // 跳转详情页
    handleToDetailPage(id) {
      this.$router.push({
        path: '/detail',
        query: {
          id
        }
      })
    },
    // 地址选择发生变化时
    changearea(picer, values) {
      this.saveChangeArea = values
    },
    handleAllCity() {
      this.province = '';    //省份
      this.city = '';            //城市
      this.country = '';    //区域
      this.dropdownTitle = '全部城市'
      this.getDataItem();
      this.$refs.item.toggle();
    },
    // 确定地址选择
    onConfirm() {
      let {saveChangeArea} = this
      let arr = []
      this.province = saveChangeArea[0].name;    //省份
      this.city = saveChangeArea[1].name;            //城市
      this.country = saveChangeArea[2].name;    //区域
      saveChangeArea.forEach((item, index) => {
        if(index != 0) {
          arr.push(item.name)
        }
      })
      this.dropdownTitle = arr.join('/')
      this.getDataItem();
      this.$refs.item.toggle();
    },
    // 获取当前城市信息
    geocodeSearch(pt) {
      var myGeo = new BMap.Geocoder();
      let that = this;
      myGeo.getLocation(pt, function (rs) {
        var addComp = rs.addressComponents; //获取地址信息
        that.province = addComp.province;    //省份
        that.city = addComp.city;            //城市
        that.country = addComp.district;    //区域
        that.dropdownTitle = `${addComp.city}/${addComp.district}`
        // var street= addComp.street;        //街道
        // var streetNumber= addComp.streetNumber;   //门牌\
        that.getDataItem();
      })
    },
    // 获取数据列表
    getDataItem() {
      let {province, city, country, foodName, foodTypeId, km} = this
      let lngLat = JSON.parse(sessionStorage.getItem("lngLat"));
      let paramsObj = {province, city, country, foodName, foodTypeId, km, longitude: lngLat.lng, latitude: lngLat.lat};
      for(var i in paramsObj) {
        if(!paramsObj[i]) {
          delete(paramsObj[i])
        }
      }
      axios.get("/authc/api/business/query_food_detail", 
        {
          params: paramsObj,
          headers: {
          'Authorization': '98bf240960f9b2dab7da73c6dff39331'
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
    // 获取分类列表
    getDataType() {
      axios.get("/authc/api/business/find_food_type", 
        {
          headers: {
          'Authorization': '98bf240960f9b2dab7da73c6dff39331',
          'Cache-Control': 'no-cache'
        }
      }).then((res) => {
        let data = res.data.data;
        let arr = [{ text: '全部分类', value: '' }];
        data.forEach(item => {
          item.text = item.name;
          item.value = item.id;
          arr.push(item)
        })
        this.typeOption = arr
      }).catch((error) => {
        console.warn(error)
      })
    },
  },
  created() {
    let that = this;
    that.getDataType();
    map.init().then(
      BMap => {
        const locationCity = new BMap.Geolocation().getCurrentPosition(
          function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              //通过Geolocation类的getStatus()可以判断是否成功定位。
              that.geocodeSearch(r.point);
              sessionStorage.setItem("lngLat", JSON.stringify(r.point))
            }
          },
          { enableHighAccuracy: true }
        );
      }
    )
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  .van-card {
    margin-bottom: 0.2rem;
  }
  .van-card__title {
    font-size: 0.4rem !important;
    margin: 0.1rem 0;
  }
}
.home-search {
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
}
.home-content {
  padding: 1.4rem 0;
}
.van-swipe-item {
  > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
.home-all-city {
  margin: 0.5rem 0.4rem 0.2rem;
  display: inline-block;
  background: chocolate;
  padding: 0.1rem 0.2rem;
  color: #fff;
  font-size: 0.3rem;
}
</style>
