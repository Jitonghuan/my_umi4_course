/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 17:20:20
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-18 17:20:21
 * @FilePath: /my_umi4_course/src/pages/suanfa/link-list/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 力扣206，141，21，19，876
//在数组a中 查找key 返回key所在的位置
//其中，n表示数组a的长度
const find=(arry:any,length:number,key:number)=>{
    //边界条件处理，如果arry为空，或者length<=0,说明数组中没有数据，就不用while循环比较了
    if(arry=null||length<=0){
        return -1

    }
    let i=0;
    //这里有两个比较操作：i<length 和arry[i]==key
    while(i<length){
        if(arry[i]==key){
            return i

        }
        ++i
    }
    return -1

}

//哨兵
//在数组a中查找key，返回key所在的位置
//其中，n表示数组a的长度
//例如a ={4,2,3,5,9,6} n=6 key=7
//a={4,2,3,5,9,6} n=6 key=6
const findKey =(a:[],n:number,key:number)=>{
    if(a==null ||n<=0){
        return -1

    }
    //这里因为要将a[n-1]的值替换成key，所以要特殊处理这个值
    if(a[n-1]==key){
        return n-1;

    }
    //把a[n-1]的临时值保存到变量Tmp中，以便以后恢复。tmp=6
    //之所以这样做的目的是：希望find()代码不要改变a数组中的内容
    let tmp=a[n-1];
    //把key的值放到a[n-1]中，此时a={4,2,3,5,9,7}
    a[n-1]=key;

    let i=0;
    //while 循环比起代码1，少了i<n这个比较操作
    while (a[i]!=key){
        ++i;
    }
    //恢复a[n-1]原来的值，此时a={4,2,3,5,9,6}
    a[n-1]=tmp;
    if(i==n-1){
        //如果i==n-1说明，在0...n-2之间都没有key，所以返回-1
        return -1

    }else{
        //否则 返回i 就是等于key值的元素的下标
        return i;
    }

}
