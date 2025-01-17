import { useQuery, useMutation } from '@tanstack/react-query'
import { fileApi } from '../api/file'

export const useFileUpload = () => {
  const { data: folders = [] } = useQuery({
    queryKey: ['uploadFolders'],
    queryFn: async () => {
      const response = await fileApi.getUploadFolders()
      return response.Data || []
    }
  })

  const uploadFile = useMutation({
    mutationFn: ({ folder, file }: { folder: string; file: File }) => fileApi.uploadFile(folder, file)
  })

  return {
    folders,
    uploadFile
  }
}
