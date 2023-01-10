require 'rails_helper'

RSpec.describe 'Announcements' do
  describe 'GET /announcements' do
    before { get '/announcements' }

    it 'announcements keyがあるはず' do
      json = JSON.parse(response.body)
      expect(json.keys).to eq(%w[announcements])
    end

    it '200を返すはず' do
      expect(response).to have_http_status(:success)
    end

    context 'お知らせが0件の場合' do
      it '空配列を返すはず' do
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
            createdAt: announcement.created_at
          }
        end
      }

      before do
        get '/announcements'
      end

      it '全お知らせを返すはず' do
        json = JSON.parse(response.body)
        expect(json['announcements']).to match(result.as_json)
      end
    end
  end

  # describe "GET /create" do
  #   it "returns http success" do
  #     get "/announcements/create"
  #     expect(response).to have_http_status(:success)
  #   end
  # end

  # describe "GET /update" do
  #   it "returns http success" do
  #     get "/announcements/update"
  #     expect(response).to have_http_status(:success)
  #   end
  # end

  # describe "GET /destroy" do
  #   it "returns http success" do
  #     get "/announcements/destroy"
  #     expect(response).to have_http_status(:success)
  #   end
  # end
end
