require 'rails_helper'

RSpec.describe 'Announcements' do
  describe 'GET #index' do
    let(:request) { get '/announcements' }

    it '200を返すこと' do
      request
      expect(response).to have_http_status(:success)
    end

    it 'pagination情報を返すこと' do
      request
      json = JSON.parse(response.body)
      expect(json).to include('pagination')
    end

    context 'お知らせが0件の場合' do
      before { request }

      it '空配列を返すこと' do
        json = JSON.parse(response.body)
        expect(json['announcements']).to eq([])
      end
    end

    context 'お知らせが1件以上の場合' do
      let!(:latest_announcement) { create(:announcement, created_at: Time.current + 1.day) }
      let(:result) {
        {
          id: latest_announcement.id,
          status: latest_announcement.status,
          contents: latest_announcement.contents,
          dateCreated: latest_announcement.created_at.in_time_zone('Asia/Tokyo').strftime('%Y-%m-%dT%H:%M:%S+09:00')
        }
      }

      before do
        create_list(:announcement, 50)
        request
      end

      it '作成日の降順で返すこと' do
        json = JSON.parse(response.body)
        expect(json['announcements'].first).to eq(result.as_json)
      end

      it 'デフォルトでは50件を返すこと' do
        json = JSON.parse(response.body)
        expect(json['announcements'].count).to eq(50)
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

  describe 'GET #show' do
    let!(:announcement) { create(:announcement) }
    let(:result) {
      {
        'id' => announcement.id,
        'status' => announcement.status,
        'contents' => announcement.contents,
        'dateCreated' => announcement.created_at.in_time_zone('Asia/Tokyo').strftime('%Y-%m-%dT%H:%M:%S+09:00')
      }
    }

    before do
      get "/announcements/#{announcement.id}"
    end

    it '対象のお知らせを返すこと' do
      json = JSON.parse(response.body)

      expect(json.dig('announcement')).to eq(result)
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

        expect(json.dig('announcement')).to match({
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
      let(:result) { { 'deleted' => true } }

      it 'お知らせが削除されること' do
        expect do
          request
        end.to change(Announcement, :count).by(-1)
      end

      it '200を返すこと' do
        request
        expect(response).to have_http_status(:ok)
      end

      it '期待するjsonを返すこと' do
        request
        json = JSON.parse(response.body)
        expect(json).to eq(result)
      end
    end
  end
end
