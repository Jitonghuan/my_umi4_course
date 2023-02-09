/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-10 15:20:57
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-10 15:20:58
 * @FilePath: /my_umi4_course/src/pages/suanfa/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//基于数组实现的顺序栈 空间复杂度为O（1） 时间复杂度O(1)
export default function ArryStack(){
    let items:any=[];
    let count:number;
    let n:number;
    //初始化数组 申请一个大小为n的数组空间
    const arrtStack=(n:number)=>{
        items= [n];
        n=n;
        count=0

    }
    //入栈操作
    const push=(item:string)=>{
        //数组空间不够了 直接返回false 入栈失败
        if(count ==n){
            return false

        }
        //将 item 放到下标为count 的位置 并且count+1
        items[count]=item;
        ++count ;
        return true;

    }

    //出栈操作
    const pop=()=>{
        //栈为空 直接返回null
        if(count==0) return null;
        //返回下标为count-1的数组元素，并且栈中元素个数 count-1
        let  tmp=items[count-1];
        --count;
        return tmp;
    }

}

//支持动态扩容的顺序栈
//对于出栈来说时间复杂度为o(1),对于入栈来说 有空闲时候入栈操作时间复杂度o(1),空间不够时 需要重新申请内存和搬移数据，
//此时时间复杂度是o(n)
//因此 对于入栈操作，最好时间复杂度是o(1)，最坏是o(n)；均摊时间复杂度就是o(1)；
//均摊时间复杂度一般都等于最好情况时间复杂度；


//栈在函数中的调用


