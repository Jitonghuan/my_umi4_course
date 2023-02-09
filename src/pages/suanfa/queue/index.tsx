//循环队列 确定好队空和队满的判断条件
export const  CircularQueue=(params:any)=>{
    let items:any=[];
    let n=0;
    let head=0;
    let tail=0;
    //申请一个大小为capacity的数组
    const circulQueue=(capacity:number)=>{
        items=[capacity]
        n=capacity;



    }
    //入队
    const enqueue=(item:any)=>{
        //队列满了
        if((tail +1) %n==head) return false;
        items[tail]=item;
        tail =(tail+1) %n;
        return true;

    }
    //出队
    const dequeue=()=>{
        //如果head==tail表示队列为空
        if(head==tail) return null 
       let ret=items[head]
       head=(head+1)%n;
       return ret;
    }
}
//阻塞队列、并发队列l