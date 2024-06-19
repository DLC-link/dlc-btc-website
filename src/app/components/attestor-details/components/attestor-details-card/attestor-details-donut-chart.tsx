import { useMemo } from 'react';

import { VStack } from '@chakra-ui/react';
import * as d3 from 'd3';

interface DataItem {
  name: string;
  value: number;
}
interface AttestorDetailsDonutChartProps {
  width: number;
  height: number;
  data: DataItem[];
}

const MARGIN = 30;

const colors = ['#6818AD', '#CC7FCF', '#B595D6', '#D9C7EB', '#EBE1F4', '#F3F0FA'];

export const AttestorDetailsDonutChart = ({
  width,
  height,
  data,
}: AttestorDetailsDonutChartProps): React.JSX.Element => {
  const radius = Math.min(width, height) / 2 - MARGIN;

  const pie = useMemo(() => {
    const pieGenerator = d3.pie<any, DataItem>().value(d => d.value);
    return pieGenerator(data);
  }, [data]);

  const arcs = useMemo(() => {
    const arcPathGenerator = d3.arc();
    return pie.map(p =>
      arcPathGenerator({
        innerRadius: 50,
        outerRadius: radius,
        startAngle: p.startAngle,
        endAngle: p.endAngle,
      })
    );
  }, [radius, pie]);

  return (
    <VStack>
      <svg width={width} height={height} style={{ display: 'inline-block' }}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arc, i) => {
            return <path key={i} d={arc || undefined} fill={colors[i % colors.length]} />;
          })}
        </g>
      </svg>
    </VStack>
  );
};
