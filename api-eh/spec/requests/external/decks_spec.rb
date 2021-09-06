# frozen_string_literal: true

require 'rails_helper'

describe External::DecksController, type: :request do
  describe 'GET #show' do
    let(:area) { 130 }

    before do
      create(:deck, area: area)
      create(:deck, area: area, is_r5: true)
    end

    context 'when contains valid area' do
      context 'and path is "tv"' do
        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-r6-tv-130.json'
          expect(response.status).to eq 200
        end
      end

      context 'and path is "editorial"' do
        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/editorial.json', params: { area: area }
          expect(response.status).to eq 200
        end
      end

      context 'and path is "visible"' do
        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/visible.json', params: { area: area }
          expect(response.status).to eq 200
        end
      end
    end

    context 'when does not contain valid area' do
      let(:invalid_area) { 0 }

      context 'and path is "editorial"' do
        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/editorial.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end
      end

      context 'and path is "visible"' do
        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/visible.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end
      end
    end
  end
end
