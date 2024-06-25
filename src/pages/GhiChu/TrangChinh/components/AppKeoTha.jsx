import { rectSortingStrategy } from "@dnd-kit/sortable";
import { GridContainer } from "./Grid/GridContainer";
import { Sortable } from "./Sortable";

const props = {
  adjustScale: true,
  Container: (props) => <GridContainer {...props} columns={5} />,
  strategy: rectSortingStrategy,
  wrapperStyle: () => ({
    width: 140,
    height: 140,
  }),
};
export default function AppKeoTha() {
  return <Sortable {...props}></Sortable>;
}
