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
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-tv.json', params: { area: area }
          expect(response.status).to eq 200
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/tv.json', params: { area: area }
          expect(response.status).to eq 200
        end
      end

      context 'and path is "radio"' do
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-radio.json', params: { area: area }
          expect(response.status).to eq 200
        end

        it 'pathes include "dk" and "r5" returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-radio-r5.json', params: { area: area }
          expect(response.status).to eq 200
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/radio.json', params: { area: area }
          expect(response.status).to eq 200
        end
      end
    end

    context 'when does not contain valid area' do
      let(:invalid_area) { 0 }

      context 'and path is "tv"' do
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-tv.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/tv.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end
      end

      context 'and path is "radio"' do
        it 'pathes include "dk" and returns success response' do
          get '/d6.6/t/ndeck/dk/recommend-radio.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end

        it 'pathes does not include "dk" and returns success response' do
          get '/d6.6/t/ndeck/recommend/radio.json', params: { area: invalid_area }
          expect(response.status).to eq 404
        end
      end
    end
  end
end
