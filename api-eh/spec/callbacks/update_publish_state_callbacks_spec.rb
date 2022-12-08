# frozen_string_literal: true

require 'rails_helper'

describe 'UpdatePublishStateCallbacks' do
  let(:playlist) { create(:playlist, api_state: api_state) }

  context 'Playlist' do
    context 'api_stateが更新されない場合' do
      let(:api_state) { :close }

      it '画像の保存先移動処理が実行されないこと' do
        expect_any_instance_of(Playlist).not_to receive(:refresh_image_storage)
        playlist.update(name: 'Awesome Playlist', api_state: :close)
      end
    end

    context 'api_stateのみ更新される場合' do
      context 'open に更新する場合' do
        context 'close -> open' do
          let(:api_state) { :close }

          it '画像の保存先移動処理が実行されること' do
            expect_any_instance_of(Playlist).to receive(:refresh_image_storage).once
            playlist.update(api_state: :open)
          end
        end
      end

      context 'close に更新する場合' do
        context 'open -> close' do
          let(:api_state) { :open }

          it '画像の保存先移動処理が実行されること' do
            expect_any_instance_of(Playlist).to receive(:refresh_image_storage).once
            playlist.update(api_state: :close)
          end
        end
      end
    end
  end
end
