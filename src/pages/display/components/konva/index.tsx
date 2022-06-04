import { useState, useEffect, useMemo, useRef } from 'react';
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container';
import { Graph, radius } from "./shape";

export default function konva(props: any) {
    const { onJoin, onRelative } = props;
    const konvaRef: any = useRef(null);
    const [g, setG] = useState<Graph>();
    //   const containerRef: any = useRef(null);

    useEffect(() => {
        if (!konvaRef) return;

        const graph = new Graph(konvaRef.current);

        graph.addTable({
            x: graph.stage.width() / 2,
            y: graph.stage.height() / 2 - radius * 2,

            tableName: "违法数据",
            recordCount: 10000,
            fill: '#1890ff',
            stroke: "#1068bb",
            onJoin,
            onRelative,

        });

        graph.addTable({
            x: graph.stage.width() / 2,
            y: graph.stage.height() / 2 + radius,
            fill: 'orange',
            stroke: '#d18702',
            strokeWidth: 1,
            tableName: "骑手名单",
            recordCount: 4000,
            onJoin,
            onRelative,
        });


        setG(graph)

    }, [konvaRef])
    return <div ref={konvaRef} id='konva' style={{ height: '100%' }}></div>
}