import { useParams } from "react-router-dom";

export default function WorkspaceDetail () {
  const { id } = useParams();

  return ( 
    <>
      <p >Workspace Detail id: {id}</p>
    </>
  )
}