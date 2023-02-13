class AbilitiesController < ApiBaseController
  def index
    render json: { abilities: ability }.to_json, status: :ok
  end
end
