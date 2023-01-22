export default function PipeLineTmpl(){
    const a={
        b:1,
        c:2
    }
    let c:string="b"
    // 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{ b: number; c: number; }"。
// 在类型 "{ b: number; c: number; }" 上找不到具有类型为 "string" 的参数的索引签名。

    //const d =a[c];
    const aq:{[key:string]:number}={
        b:1,
        c:2
    }
    interface A{
        b:number
        c:number
    }
    const ab:A={
        b:1,
        c:2
    }
    const ac:A & {[key:string]:number}={
        b:1,
        c:2
    }
    return(
        <div>

        </div>
    )
}