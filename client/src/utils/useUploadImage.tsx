import { useRef, useState } from 'react'
import {
  InputGroup,
  Box,
  Button,
  Icon,
  FormControl,
  FormLabel,
  createStandaloneToast
} from '@chakra-ui/react'
import { FiFile } from 'react-icons/fi'

const backendUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BACK_END_HOST_PROD
    : process.env.NEXT_PUBLIC_BACK_END_HOST_DEV

export const useUploadImage = () => {
  const [uploadImageUrls, setUploadImageUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => inputRef.current?.click()

  return {
    uploadImageUrls,
    setUploadImageUrls,
    renderInputUpload: (
      <FormControl>
        <FormLabel>Hình ảnh</FormLabel>
        <InputGroup onClick={handleClick}>
          <input
            type={'file'}
            multiple
            hidden
            accept={'image/*'}
            ref={e => (inputRef.current = e)}
            onChange={async e => {
              const data = new FormData()
              const files = e.target.files || []
              Array.from(files).map(file => data.append('files', file))
              setLoading(true)
              fetch(`${backendUrl}/api/image/upload`, {
                method: 'post',
                body: data
              })
                .then(res => res.json())
                .then(data => {
                  setLoading(false)
                  setUploadImageUrls(data.images)
                })
                .catch(err => console.log(err))
            }}
          />
          <Box>
            <Button isLoading={loading} leftIcon={<Icon as={FiFile} />}>
              Upload
            </Button>
          </Box>
        </InputGroup>
      </FormControl>
    )
  }
}

export const useDeleteImage = (publicId: string) => {
  const toast = createStandaloneToast()
  fetch(`${backendUrl}/api/image/delete`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ publicId: publicId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status !== 'success') return
      toast({
        title: data.message,
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    })
    .catch(err => console.log(err))
}
