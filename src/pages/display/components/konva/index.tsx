import { useState, useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from 'react';
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container';
import { Graph, radius, RelatedData, defaultCircleFill } from "./shape";

export default forwardRef(function konva(props: any, ref: any) {
    const { onJoin, onRelative, changeData } = props;
    const konvaRef: any = useRef(null);
    const [g, setG] = useState<Graph>();
    //   const containerRef: any = useRef(null);
    useImperativeHandle(
        ref,
        () => ({
            treeView: (related: RelatedData) => {
                // function name
                g?.showRelativeTree(related);
            },
        }),
        [g],
    );
    useEffect(() => {
        if (!konvaRef) return;

        const graph = new Graph(konvaRef.current);

        graph.addTable({
            x: graph.stage.width() / 2,
            y: graph.stage.height() / 2 - radius * 2,

            tableName: "医保上传检验单",
            recordCount: 535,
            shadowColor: defaultCircleFill,
            shadowBlur: 20,
            onJoin,
            onRelative,
            changeData,
        });

        graph.addTable({
            x: graph.stage.width() / 2,
            y: graph.stage.height() / 2 + radius,
            fill: 'orange',
            stroke: '#d18702',
            strokeWidth: 1,
            tableName: "校验明细",
            recordCount: 534,
            onJoin,
            onRelative,
            changeData
        });


        setG(graph)

    }, [konvaRef])
    return <div ref={konvaRef} id='konva' style={{ height: '100%' }}></div>
})