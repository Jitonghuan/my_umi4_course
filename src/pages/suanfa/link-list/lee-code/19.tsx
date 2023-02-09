//19、删除链表的倒数第 N 个结点
//给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
//方法一：计算链表长度
//一种容易想到的方法是，我们首先从头节点开始对链表进行一次遍历，得到链表的长度 LL。随后我们再从头节点开始对链表进行一次遍历，当遍历到第 L-n+1L−n+1 个节点时，它就是我们需要删除的节点。

//时间复杂度：O(L)O(L)，其中 LL 是链表的长度。

function Solution1(){
    const listnode=(head:any,n:number)=>{
        let dummy:any=listnode(0,head)
        let length=getLength(head);
        let cur=dummy;
        for(let i=1;i<length-n+1;++i){
            cur=cur.next;

        }
        cur.next=cur.next.next;
        let  ans=dummy.next;
        return ans


    }
    const getLength=(head:any)=>{
        let length=0;
        while (head!=null){
            ++length;
            head=head.next
        }
        return length
    }
}
