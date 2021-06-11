# frozen_string_literal: true

require 'rails_helper'

describe External::DecksController, type: :request do
  describe 'GET #show' do
    let(:area) { 130 }

    before do
      create(:deck, area: area)
    end

    context 'when contains valid area' do
      context 'and path is "editorial"' do
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-editorial.json', params: { area: area }
          expect(response.status).to eq 200
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/editorial.json', params: { area: area }
          expect(response.status).to eq 200
        end
      end

      context 'and path is "visible"' do
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-visible.json', params: { area: area }
          expect(response.status).to eq 200
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/visible.json', params: { area: area }
          expect(response.status).to eq 200
        end
      end
    end

    context 'when does not contain valid area' do
      let(:invalid_area) { 0 }

      context 'and path is "editorial"' do
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-editorial.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/editorial.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end
      end

      context 'and path is "visible"' do
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-visible.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/visible.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end
      end
    end
  end
end
