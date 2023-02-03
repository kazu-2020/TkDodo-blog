class AnnouncementsController < ApiBaseController
  def index
    page, per = set_pagination
    @announcements = Announcement.order(created_at: :desc).page(page).per(per)
  end

  def create
    @announcement = Announcement.new(announcement_params)
    return if @announcement.save

    render json: { messages: @announcement.errors.full_messages }, status: :unprocessable_entity
  end

  def show
    @announcement = Announcement.find(params[:id])
  end

  def update
    @announcement = Announcement.find(params[:id])
    return if @announcement.update(announcement_params)

    render json: { messages: @announcement.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    announcement = Announcement.find(params[:id])
    announcement.destroy!

    render json: { deleted: true }
  end

  private

  def announcement_params
    params.require(:announcement).permit(:status, :contents)
  end
end
