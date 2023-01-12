require 'rails_helper'

RSpec.describe 'Announcements' do
  describe 'GET #index' do
    let(:request) { get '/announcements' }

    it '200を返すこと' do
      request
      expect(response).to have_http_status(:success)
    end

    context 'お知らせが0件の場合' do
      before { request }

      it '空配列を返すこと' do
        json = JSON.parse(response.body)
        expect(json['announcements']).to eq([])
      end
    end

    context 'お知らせが1件以上の場合' do
      let!(:announcements) { create_list(:announcement, 2) }
      let(:result) {
        announcements.map do |announcement|
          {
            id: announcement.id,
            status: announcement.status,
            contents: announcement.contents,
            dateCreated: announcement.created_at.in_time_zone('Asia/Tokyo').strftime('%Y-%m-%dT%H:%M:%S+09:00')
          }
        end
      }

      before { request }

      it '全お知らせを返すこと' do
        json = JSON.parse(response.body)
        expect(json['announcements']).to eq(result.as_json)
      end
    end
  end

  describe 'POST #create' do
    context 'parameterが正常な場合' do
      let(:request) { post '/announcements', params: { announcement: { status: 'improved', contents: 'テストです' } } }

      it 'お知らせが追加されること' do
        expect do
          request
        end.to change(Announcement, :count).by(1)
      end

      it '作成されたお知らせを返すこと' do
        request
        json = JSON.parse(response.body)

        expect(json).to match({
                                'id' => a_kind_of(Integer),
                                'status' => 'improved',
                                'contents' => 'テストです',
                                'dateCreated' => a_kind_of(String)
                              })
      end
    end

    context 'parameterが異常な場合' do
      let(:request) { post '/announcements', params: { announcement: { contents: nil } } }

      it 'お知らせが追加されないこと' do
        expect do
          request
        end.not_to change(Announcement, :count)
      end

      it '422エラーを返すこと' do
        request
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH #update' do
    let!(:announcement) { create(:announcement) }

    context 'parameterが正常な場合' do
      before do
        patch "/announcements/#{announcement.id}", params: { announcement: { status: 'improved', contents: '更新' } }
      end

      it 'お知らせが更新されること' do
        expect(announcement.reload.contents).to eq('更新')
      end

      it '更新されたお知らせを返すこと' do
        json = JSON.parse(response.body)

        expect(json).to match({
                                'id' => announcement.id,
                                'status' => 'improved',
                                'contents' => '更新',
                                'dateCreated' => a_kind_of(String)
                              })
      end
    end

    context 'parameterが異常な場合' do
      let(:request) { patch "/announcements/#{announcement.id}", params: { announcement: { contents: '' } } }

      before { request }

      it 'お知らせが更新されないこと' do
        expect(announcement.reload.contents).not_to eq('更新')
      end

      it '422エラーを返すこと' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:announcement) { create(:announcement) }

    context 'parameterが正常な場合' do
      let(:request) { delete "/announcements/#{announcement.id}" }

      it 'お知らせが削除されること' do
        expect do
          request
        end.to change(Announcement, :count).by(-1)
      end

      it '204を返すこと' do
        request
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
