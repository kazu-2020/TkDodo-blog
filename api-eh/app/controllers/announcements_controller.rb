class AnnouncementsController < ApiBaseController
  def index
    @announcements = Announcement.all
  end

  def create; end

  def update; end

  def destroy; end
end
