# frozen_string_literal: true

# FIXME: API依存のspec responseをmockする
describe OembedController, type: :request do
  describe 'Howto url' do
    it 'returns success response' do
      get '/embed/te/VNM43R2K9L/howto/55'
      expect(response.status).to eq 200
    end
  end

  describe 'Event url' do
    it 'returns success response' do
      get '/embed/te/GV711R4WQV/event/94'
      expect(response.status).to eq 200
    end
  end

  describe 'Faqpage url' do
    it 'returns success response' do
      get '/embed/te/37WW75ZGXJ/faqpage/965'
      expect(response.status).to eq 200
    end
  end
end
