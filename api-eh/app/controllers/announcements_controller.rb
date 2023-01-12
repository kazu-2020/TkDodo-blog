class AnnouncementsController < ApiBaseController
  DEFAULT_PER = 20

  def index
    @announcements = Announcement.order(created_at: :desc).limit(DEFAULT_PER)
  end

  def create
    @announcement = Announcement.new(announcement_params)
    return if @announcement.save

    render json: { messages: @announcement.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    @announcement = Announcement.find(params[:id])
    return if @announcement.update(announcement_params)

    render json: { messages: @announcement.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    announcement = Announcement.find(params[:id])
    announcement.destroy!

    head :no_content
  end

  private

  def announcement_params
    params.require(:announcement).permit(:status, :contents)
  end
end
