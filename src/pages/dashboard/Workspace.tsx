import { useWorkspace } from "@/hooks/useWorkspace";
import { Link } from "react-router-dom";

export default function Workspaces () {
  const { workspaces } = useWorkspace();
  return (
    <>
      <p>List workspace</p>
      { workspaces.map( (item) => {
        return (
          <Link to={"/workspaces/${item.id}"} >
            <button key={item.id}>{item.name}</button>
          </Link>
        )
      })}
    </>
  )
}