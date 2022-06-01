# frozen_string_literal: true

require 'rails_helper'

describe EditorDataToMarkdown, type: :model do
  describe '#call' do
    subject { described_class.new(editor_data: editor_data).call }

    let(:editor_data) do
      {
        'time' => 1_599_617_474_944,
        'blocks' => [
          { 'data' => {
            'text' => '見出し<b>太字</b><br>改行<i>イタリック</i><b><i>太字イタリック</i></b>', 'level' => 2
          },
            'type' => 'header' },
          { 'data' => {
            'text' => '見出しh3', 'level' => 3
          },
            'type' => 'header' },
          { 'data' => {
            'text' => '見出しh4', 'level' => 4
          },
            'type' => 'header' },
          { 'data' => {
            'text' => 'テキスト<b>太字</b><br>改行<i>イタリック</i><b><i>太字イタリック</i></b>'
          },
            'type' => 'paragraph' },
          { 'data' => {
            'text' => '&nbsp;テキ&nbsp; スト&nbsp;'
          },
            'type' => 'paragraph' },
          {
            'data' => {
              'file' => {
                'url' => '/uploads/private/article/ts/8XR6MQY3W7/8XR6MQY3W7-body_726e2d70c0e70fd831820ec43de53110.jpg'
              },
              'caption' => '&nbsp;hello&nbsp;',
              'stretched' => false,
              'withBorder' => false,
              'withBackground' => false
            },
            'type' => 'image'
          },
          {
            'data' => {
              'link' => 'https://www.yahoo.co.jp/',
              'meta' => {
                'description' => '&nbsp;Yahoo! JAPAN&nbsp;'
              }
            },
            'type' => 'linkTool'
          },
          {
            'data' => {
              'service' => 'dokos',
              'source' => 'https://movie-a.nhk.or.jp/movie/?v=wlkz7o70',
              'embed' => 'https://movie-a.nhk.or.jp/movie/?v=wlkz7o70&type=video&dir=EGC&sns=false&autoplay=false&mute=false',
              'width' => 580,
              'height' => 320,
              'caption' => '&nbsp;this is dokos.&nbsp;'
            },
            'type' => 'embed'
          },
          { 'data' => {
            'items' => %w[&nbsp;<b>one</b>&nbsp; <i>two</i> three<br>three <b><i>four</i></b>],
            'style' => 'ordered'
          }, 'type' => 'list' },
          { 'data' => {
            'items' => %w[<b>ichi</b> <i>ni</i> san<br>san <b><i>shi</i></b>],
            'style' => 'unordered'
          }, 'type' => 'list' },
          {
            'data' => {
              'link' => 'https://dev-www.nhk.jp/p/ts/6X8L7Z8VK8/episode/te/KXK81VLLKZ/',
              'event' => {},
              'howTo' => {},
              'recipe' => {},
              'series' => {
                'name' => 'オトッペ'
              },
              'episode' => {
                'name' => '「グラストンのいやしの庭」',
                'description' => '音から生まれた不思議な生きもの・オトッペと世界一のＤＪを目指すシーナの大冒険。',
                'firstBroadcastDate' => '2020-02-10T08:40:00+09:00'
              },
              'episodeId' => 'KXK81VLLKZ',
              'selectedType' => 'episode'
            },
            'type' => 'multiTypeEpisode'
          }
        ],
        'version' => '2.18.0'
      }
    end

    it do
      s = <<~MARKDOWN
        ## 見出し**太字**#{'  '}
        改行*イタリック****太字イタリック***

        ### 見出しh3

        #### 見出しh4

        テキスト**太字**#{'  '}
        改行*イタリック****太字イタリック***

        テキ  スト

        ![](/uploads/private/article/ts/8XR6MQY3W7/8XR6MQY3W7-body_726e2d70c0e70fd831820ec43de53110.jpg "hello")

        [Yahoo! JAPAN](https://www.yahoo.co.jp/)

        [this is dokos.](https://movie-a.nhk.or.jp/movie/?v=wlkz7o70)

        1. **one**
        1. *two*
        1. three#{'  '}
        three
        1. ***four***

        - **ichi**
        - *ni*
        - san#{'  '}
        san
        - ***shi***

        [「グラストンのいやしの庭」](https://dev-www.nhk.jp/p/ts/6X8L7Z8VK8/episode/te/KXK81VLLKZ/)

      MARKDOWN

      expect(subject).to eq s.chomp
    end
  end
end
