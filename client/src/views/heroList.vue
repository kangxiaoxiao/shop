<template>
    <div class="heroListWrapper">
        <el-col :span="24" class="item">
            <el-table
              v-if="herosList && herosList.length>0"
              :data="herosList"
            >
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="name"
                    label="英雄"
                   >
                </el-table-column>
                <el-table-column
                  prop="age"
                  label="年龄"
                ></el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别"
                ></el-table-column>
                <el-table-column
                 prop="nativePlace"
                 label="籍贯"
                ></el-table-column>
                <el-table-column
                  prop="location"
                  label="位置"
                ></el-table-column>
                <el-table-column
                 prop="lines"
                 label="台词"
                ></el-table-column>
                <el-table-column
                        prop="cover"
                        label="封面"
                >
                    <template slot-scope="scope"
                              v-if="scope.row.cover"
                    >
                        <img :src="img_headUrl+scope.row.cover" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template  slot-scope="scope">
                        <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
                        <el-button type="text" @click="changeDetail(scope.row)">修改</el-button>
                        <el-button type="text" @click="deleteHero(scope.row)">删除</el-button>
                        <!--<el-button type="text" @click="addImg(scope.row)">添加图片</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="24" class="item">
            <el-button @click="addHero">新增</el-button>
        </el-col>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "heroList",
        data(){
            return{
                herosList:[],
                img_headUrl:""
            }
        },
        mounted(){
            let _this=this;
            _this.img_headUrl=process.env.VUE_APP_IMG_HEAD_URL;
            console.log("img_headUrl",_this.img_headUrl);
            _this.getHeroList();
        },
        methods:{
            getHeroList(){
                let _this=this;
                axios.get("/heros").then(res=>{
                    if(res.data.status==0){
                        _this.herosList=res.data.heros;
                    }
                })
            },
            addHero(){
                this.$router.push({path:"/editHero"})
            },
            showDetail(row){
              this.$router.push({path:"/heroDetail",query:{id:row._id}});
            },
            changeDetail(row){
                this.$router.push({path:"/editHero",query:{id:row._id}})
            },
            deleteHero(row){
                let _this=this;
                this.$confirm('确定删除该英雄吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.sureDeleteHero(row);
                }).catch(() => {

                });
            },
            sureDeleteHero:function(row){
                let _this=this;
                let params={
                    id:row._id
                };
                axios({
                    method:"post",
                    url:"/heros/deleteHero",
                    data:params
                }).then(res=>{
                    if(res.data.status==0){
                        _this.$notify({
                            message:"删除成功",
                            type: 'warning'
                        });
                        _this.getHeroList();
                    }else{
                        _this.$notify({
                            message:res.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            addImg(row){
                let _this=this;
                _this.$router.push({path:"/uploadImg",query:{id:row._id}})
            }
        }
    }
</script>

<style scoped lang="scss">
    .heroListWrapper{
        img{
            display:block;
            width:100%;
            height:auto;
        }
        .item{
            margin-bottom:15px;
        }
    }
</style>