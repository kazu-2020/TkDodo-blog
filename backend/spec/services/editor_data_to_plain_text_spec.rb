# frozen_string_literal: true

require 'spec_helper'

describe EditorDataToPlainText, type: :model do
  describe '#call' do
    let(:editor_data) do
      {
        'time' => 1_599_617_474_944,
        'blocks' => [
          { 'data' => {
            'text' => '見出し<b>太字</b><br>改行<i>イタリック</i><b><i>太字イタリック</i></b>', 'level' => 2
          },
            'type' => 'header' },
          { 'data' => {
            'text' => 'テキスト<b>太字</b><br>改行<i>イタリック</i><b><i>太字イタリック</i></b>'
          },
            'type' => 'paragraph' },
          {
            'data' => {
              'file' => {
                'url' => '/uploads/private/article/ts/8XR6MQY3W7/8XR6MQY3W7-body_726e2d70c0e70fd831820ec43de53110.jpg'
              },
              'caption' => 'hello',
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
                'description' => 'Yahoo! JAPAN'
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
              'caption' => 'this is dokos.'
            },
            'type' => 'embed'
          },
          { 'data' => {
            'items' => %w[<b>one</b> <i>two</i> three<br>three <b><i>four</i></b>],
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

    subject { EditorDataToPlainText.new(editor_data: editor_data).call }

    it do
      s = <<~TEXT
        見出し太字#{'  '}
        改行イタリック太字イタリック

        テキスト太字#{'  '}
        改行イタリック太字イタリック

        Yahoo! JAPAN

        this is dokos.

        1. one
        1. two
        1. three#{'  '}
        three
        1. four

        ･ ichi
        ･ ni
        ･ san#{'  '}
        san
        ･ shi

        「グラストンのいやしの庭」

      TEXT

      is_expected.to eq s.chomp
    end
  end
end
