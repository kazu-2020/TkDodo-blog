import axios from 'axios'
import EditorJS from '@editorjs/editorjs'

import { notifyError, destroyCurrentBlock } from '@/lib/editorjs/functions'
import { API_BASE_URL } from '@/config'

export const getImageByUrlEndpoint = (playlistUId: string | undefined) =>
  `${API_BASE_URL}/playlists/${playlistUId}/upload_article_image_by_url`

export const getImageByFileEndpoint = (playlistUId: string | undefined) =>
  `${API_BASE_URL}/playlists/${playlistUId}/upload_article_image_by_file`

const validateFileSize = (file: File) => {
  const limitSize = 10 * 1024 ** 2 // 10MB
  return file.size < limitSize
}

const validateFileWidth = (img: any) => {
  const limitWidth = 5
  return img.width < limitWidth
}
const validateFileHeight = (img: any) => {
  const limitHeight = 5000
  return img.height < limitHeight
}
const loadImageAsync = (src: any) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = src
  })

function FileReaderAsync(file: any) {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => resolve(e)
    fileReader.readAsDataURL(file)
  })
}

const postImage = (endpoint: string, file: any) => {
  const formData = new FormData()
  // API 側で ASCII-8BIT のファイル名を受け取れないため、この時点でファイル名を固定する
  formData.append('image', file, 'new_image')
  return axios
    .post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => ({
      success: 1,
      file: {
        url: res.data.file.url
      }
    }))
}

export const postImageByFile = (
  file: any,
  playlistUid: string | undefined,
  editor: EditorJS | null
) =>
  FileReaderAsync(file)
    .then((e: any) => loadImageAsync(e.target.result))
    // eslint-disable-next-line max-statements
    .then((img: any) => {
      let errorMessage = ''
      if (!validateFileWidth(img)) {
        errorMessage = '画像ファイルの幅を5000px以下にしてください'
      }
      if (!validateFileHeight(img)) {
        errorMessage = '画像ファイルの高さを5000px以下にしてください'
      }
      if (!validateFileSize(file)) {
        errorMessage = '画像ファイルのサイズを10MB以下にしてください'
      }
      if (errorMessage !== '') {
        if (editor !== null) {
          notifyError(editor, errorMessage)
          destroyCurrentBlock(editor)
        }
        return {
          success: 0,
          file: {
            url: null
          }
        }
      }
      return postImage(getImageByFileEndpoint(playlistUid), file)
    })

export const postImageByUrl = (
  url: string,
  playlistUid: string | undefined,
  editor: EditorJS | null
) =>
  axios
    .post(getImageByUrlEndpoint(playlistUid), { url })
    .then((res) => ({
      success: 1,
      file: {
        url: res.data.file.url
      }
    }))
    .catch((err) => {
      if (editor !== null) {
        err.response.data.messages.forEach((msg: string) =>
          notifyError(editor, msg)
        )
        destroyCurrentBlock(editor)
      }

      return {
        success: 0,
        file: {
          url: null
        }
      }
    })
