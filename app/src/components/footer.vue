<template>
    <div class="footer">
        <router-view/>
        <van-tabbar route>
            <van-tabbar-item
                replace
                v-for="(item, index) in routerItem"
                :key="index"
                :to="item.path"
                :icon="item.icon"
            >
              {{item.name}}
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
export default {
  name: "Footer",
  data() {
    return {
      routerItem: [
        { path: "/", icon: "home-o", name: "首页" },
        { path: "/order", icon: "cart-o", name: "订单" },
        { path: "/list", icon: "friends-o", name: "评论圈" }
        // { path: "/myself", icon: "user-o", name: "我的" }
      ],
      active: 0
    };
  },
  methods: {}
};
</script>
<style lang="less">
</style>

