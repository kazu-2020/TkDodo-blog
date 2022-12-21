require 'rails_helper'

RSpec.describe User do
  describe '#from_token_payload' do
    let(:email) { 'hoge@example.com' }
    let(:payload) { { 'sub' => email, 'uid' => SecureRandom.uuid } }

    context 'ユーザーが存在する場合' do
      let!(:user) { create(:user, email: email) }

      it '存在するユーザー取得できること' do
        expect(described_class.from_token_payload(payload)).to eq user
      end
    end

    context 'ユーザーが存在しない場合' do
      before do
        allow_any_instance_of(OktaClient).to receive(:user).and_return({ profile: {
                                                                         firstName: 'api_first_name',
                                                                         lastName: 'api_last_name'
                                                                       } })
      end

      it 'apiから取得した名前のユーザーが作成されていること' do
        user = described_class.from_token_payload(payload)
        expect(user.first_name).to eq 'api_first_name'
        expect(user.last_name).to eq 'api_last_name'
      end
    end
  end
end
