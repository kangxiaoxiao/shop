<template>
    <div class="detailWrapper">
        <ul>
            <li>
                <span>英雄：</span>
                <span>{{heroDetail.name}}</span>
            </li>
            <li>
                <span>年龄：</span>
                <span>{{heroDetail.name}}</span>
            </li>
            <li>
                <span>籍贯：</span>
                <span>{{heroDetail.nativePlace}}</span>
            </li>
            <li>
                <span>位置：</span>
                <span>{{heroDetail.location}}</span>
            </li>
            <li>
                <span>台词：</span>
                <span>{{heroDetail.lines}}</span>
            </li>
            <li>
                <span>封面：</span>
                <img class="cover" v-if="heroDetail &&heroDetail.cover" :src="img_headUrl+heroDetail.cover" alt="封面">
                <span v-else>暂无</span>
            </li>
            <li>
                <span>详情：</span>
                <div v-if="heroDetail &&heroDetail.imgs && heroDetail.imgs.length>0" class="imgItemWrapper">
                    <div class="imgItem"
                         v-for="(item,$index) in heroDetail.imgs"
                         :key="$index"
                         :style="{background:'url('+(img_headUrl+item)+') center center no-repeat',backgroundSize:'cover'}"
                    ></div>
                   <!-- <img  :src="img_headUrl+item"  alt="详情">-->
                </div>
                <span v-else>暂无</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "heroDetail",
        data(){
            return{
              img_headUrl:"",
              heroDetail:{}
            }
        },
        mounted(){
            this.img_headUrl=process.env.VUE_APP_IMG_HEAD_URL;
            this.getHeroDetail()
        },
        methods:{
            getHeroDetail(){
                let _this=this;
                let id=_this.$route.query.id;
                axios({
                    method: 'get',
                    url: '/heros/heroDetail',
                    params: {
                       _id: id
                    }
                }).then(res=>{
                    if(res.data.status==0){
                      _this.heroDetail=res.data.hero;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
 .detailWrapper{
     ul{
         li{
             position:relative;
             overflow: hidden;
             margin-bottom:15px;
             span{
                 font-size:16px;
                 vertical-align: top;
             }
             .cover{
                 display:inline-block;
                 width:200px;
                 height:auto;
             }
             .imgItemWrapper{
                 display:inline-block;
                .imgItem{
                    display:inline-block;
                    width:200px;
                    height:200px;
                    & + .imgItem{
                        margin-left:15px;
                    }
                }
             }
         }
     }
 }
</style>