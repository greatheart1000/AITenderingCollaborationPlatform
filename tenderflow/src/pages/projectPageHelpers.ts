import {useParams} from 'react-router-dom';

export function useProjectId() {
  const {projectId} = useParams();
  return projectId ?? '';
}

