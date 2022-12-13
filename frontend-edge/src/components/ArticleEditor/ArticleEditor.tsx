import { HiOutlinePlus } from 'react-icons/hi'
import { useEffect, useRef, useState } from 'react'
import Header from '@editorjs/header'
import Embed from '@editorjs/embed'
import EditorJS, { API, OutputData } from '@editorjs/editorjs'
// Original Plugins
// FIXME: 仕様が固まったら実装する
// import MultiTypeEpisode from '@/lib/editorjs/multi_type_episode'
import { Button } from '@chakra-ui/react'

import { postImageByFile, postImageByUrl } from '@/lib/editorjs/postImage'
import { i18n } from '@/lib/editorjs/i18n'
import { isFirstBlockEmpty, unshiftEmptyBlock } from '@/lib/editorjs/functions'
import ExtendImageTool from '@/lib/editorjs/extend_image_tool'
import DescriptionLinkTool from '@/lib/editorjs/description_link_tool'
import DefaultUnorderedList from '@/lib/editorjs/default_unordered_list'
import { API_BASE_URL } from '@/config'

type ArticleEditorProps = {
  playlistUid?: string | undefined
  defaultValue: OutputData | undefined
  placeholder?: string
  readOnly?: boolean
  minHeight?: number
  onReady: () => void
  onSave: (data: OutputData) => void
  onChange: (api: API, event: CustomEvent) => void
}

const InsertBlockButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    colorScheme="gray"
    variant="outline"
    leftIcon={<HiOutlinePlus />}
    color="gray"
    w="100%"
    justifyContent="start"
    border="1px dotted"
    borderColor="gray.400"
    onClick={onClick}
  >
    新しいブロックを追加する
  </Button>
)

// NOTE: editorjsのconstructorの引数からインスタンスを参照するせいで分離しづらいため
// eslint-disable-next-line max-lines-per-function
export const ArticleEditor = ({
  playlistUid,
  defaultValue,
  placeholder,
  readOnly,
  minHeight,
  onReady,
  onChange,
  onSave
}: ArticleEditorProps) => {
  const id = 'editorjs'
  const editorJS = useRef<EditorJS | null>(null)
  const [isShowInsertBlockButton, setIsShowInsertBlockButton] = useState(false)

  useEffect(() => {
    if (editorJS.current === null) {
      editorJS.current = new EditorJS({
        placeholder,
        readOnly,
        minHeight,
        holder: id,
        data: defaultValue,
        i18n,
        tools: {
          paragraph: {
            inlineToolbar: ['bold', 'italic']
          },
          header: {
            class: Header,
            config: {
              placeholder: '見出しを入力してください',
              levels: [2, 3, 4],
              defaultLevel: 2
            },
            inlineToolbar: ['bold', 'italic']
          },
          image: {
            class: ExtendImageTool,
            config: {
              uploader: {
                uploadByFile(file: any) {
                  return postImageByFile(file, playlistUid, editorJS.current)
                },
                uploadByUrl(url: string) {
                  return postImageByUrl(url, playlistUid, editorJS.current)
                }
              }
            }
          },
          list: {
            class: DefaultUnorderedList,
            inlineToolbar: ['bold', 'italic']
          },
          linkTool: {
            class: DescriptionLinkTool,
            config: {
              endpoint: `${API_BASE_URL}/editor/fetch_link`
            }
          },
          embed: {
            class: Embed,
            config: {
              services: {
                dokos: {
                  regex:
                    /https?:\/\/movie-a.nhk.or.jp\/(movie.*)\/\?.*v=([^/?&]*).*/,
                  embedUrl:
                    'https://movie-a.nhk.or.jp/<%= remote_id %>&type=video',
                  html: '<iframe frameborder="0" scrolling="no" align="middle" height="360" width="640" allowtransparency="true" allowfullscreen></iframe>',
                  height: 360,
                  width: 640,
                  id: (ids: any) => ids.join('/?v=') // movie_stg/?v=<%= remote_id %>
                },
                richlink: {
                  regex:
                    /(https?:\/\/(dev-|stg-)?www\.(nhk.jp|nhk.or.jp|nhk-ondemand.jp)\/?.*)/,
                  embedUrl:
                    'https://dev-embed.www.nhk.jp/ogp?url=<%= remote_id %>&height=185',
                  html: '<iframe frameborder="0" scrolling="no" align="middle" width="640" height="185" allowtransparency="true" allowfullscreen></iframe>',
                  height: 185,
                  width: 640,
                  id: (ids: any) => ids[0]
                }
              }
            }
          }
          // FIXME: 仕様が固まったら実装する
          // multiTypeEpisode: {
          //   class: MultiTypeEpisode,
          //   inlineToolbar: false,
          //   config: {
          //     endpoint: process.env.apiBaseUrl,
          //     playlistId: this.playlistId
          //   }
          // }
        },
        onChange(api: API, event: CustomEvent) {
          editorJS.current?.save().then((res) => {
            onSave(res)
          })
          onChange(api, event)
          setIsShowInsertBlockButton(!isFirstBlockEmpty(editorJS.current))
        },
        onReady() {
          onReady()
          setIsShowInsertBlockButton(!isFirstBlockEmpty(editorJS.current))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isShowInsertBlockButton && (
        <InsertBlockButton
          onClick={() => {
            setIsShowInsertBlockButton(false)
            unshiftEmptyBlock(editorJS.current)
          }}
        />
      )}
      <div id={id} />
    </>
  )
}

ArticleEditor.defaultProps = {
  placeholder: '',
  readOnly: false,
  minHeight: 0
}
