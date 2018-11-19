<template>
    <div class="uploadImgWrapper">
        <div >
            <h2>单图上传</h2>
            <input type="file" name="logo"  ref="avatar" />
            <el-button @click="singleSubmit">提交</el-button>
        </div>
        <hr/>
        <div >
            <h2>多张图上传</h2>
            <input type="file" name="logo"  multiple ref="multiple_avatar" />
            <el-button @click="multipleSubmit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "uploadImg",
        data(){
            return{
                id:"",
                files:"",
                multipleFiles:""
            }
        },
        mounted(){
            this.id=this.$route.query.id||""
        },
        methods:{
            //单张图片上传
            singleSubmit:function(){
                let _this=this;
                _this.files=_this.$refs.avatar.files;
                var formData = new FormData();
                formData.append('avatar',_this.files[0]);  //将图片内容放入formData中
                formData.append("id",_this.id)
                axios({
                    method:"post",
                    url:"/heros/single_uploadImg",
                    data:formData
                }).then(res=>{
                    if(res.data.status==0){
                        this.$notify({
                            message: '添加图片成功！',
                            type: 'success'
                        });
                        _this.$router.push({path:"/heroList"});
                    }else{
                        this.$notify({
                            message:res.data.msg,
                            type: 'warning'
                        });
                    }
                });

            },
            //多张图片上传
            multipleSubmit(){
                let _this=this;
                _this.multipleFiles=[..._this.$refs.multiple_avatar.files];
                console.log("多张图片",_this.multipleFiles);
                var formData = new FormData();
                for (let i = 0; i < _this.multipleFiles.length; i++) {
                    formData.append('photos',_this.multipleFiles[i]);
                }
                formData.append("id",_this.id)
                axios({
                    method:"post",
                    url:"/heros/multiple_uploadImg",
                    data:formData
                }).then(res=>{
                    if(res.data.status==0){
                        this.$notify({
                            message: '添加图片成功！',
                            type: 'success'
                        });
                        _this.$router.push({path:"/heroList"});
                    }else{
                        this.$notify({
                            message:res.data.msg,
                            type: 'warning'
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>