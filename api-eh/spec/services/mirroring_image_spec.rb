require 'rails_helper'

describe 'MirroringImage' do
  before do
    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  let(:playlist) { create :playlist }

  it '自動的にpublic_storeにアップロードされていないこと' do
    attacher = ImageUploader::Attacher.from_model(playlist.reload, :logo_image)

    expect(File).to exist(Rails.root.join('public', 'uploads', 'test', 'private') + attacher.file.id)
    expect(File).not_to exist(Rails.root.join('public', 'uploads', 'test', 'public') + attacher.file.id)
  end

  describe '#upload' do
    let!(:s3_resource_mock) { instance_double(Aws::S3::Bucket) } # NOTE: Aws::S3::Resourceのモック

    before do
      # NOTE: テスト環境の動作確認のため、テスト環境でもスキップしないようにする
      allow_any_instance_of(MirrorUploadImageJob).to receive(:skip_environment?).and_return(false)
      allow(Aws::S3::Bucket).to receive(:new).and_return(s3_resource_mock)
      allow(s3_resource_mock).to receive(:object).and_return(s3_resource_mock)
    end

    it 'S3バケットにオブジェクトが存在していたら public store に画像がアップロードされること' do
      allow(s3_resource_mock).to receive(:exists?).and_return(true)

      attacher = ImageUploader::Attacher.from_model(playlist.reload, :logo_image)
      MirroringImage.upload(attacher: attacher)

      expect(File).to exist(Rails.root.join('public', 'uploads', 'test', 'private') + attacher.file.id)
      expect(File).to exist(Rails.root.join('public', 'uploads', 'test', 'public') + attacher.file.id)
    end

    it 'S3バケットにオブジェクトが存在していなければ public store に画像がアップロードされず終了すること' do
      allow(s3_resource_mock).to receive(:exists?).and_return(false)

      attacher = ImageUploader::Attacher.from_model(playlist.reload, :logo_image)
      MirroringImage.upload(attacher: attacher)

      expect(File).not_to exist(Rails.root.join('public', 'uploads', 'test', 'public') + attacher.file.id)
    end
  end

  describe '#delete' do
    it 'public storeから画像が削除されること' do
      attacher = ImageUploader::Attacher.from_model(playlist.reload, :logo_image)

      MirroringImage.delete(attacher: attacher)

      expect(File).to exist(Rails.root.join('public', 'uploads', 'test', 'private') + attacher.file.id)
      expect(File).not_to exist(Rails.root.join('public', 'uploads', 'test', 'public') + attacher.file.id)
    end

    it 'playlistが削除されても画像が消えること' do
      attacher = ImageUploader::Attacher.from_model(playlist.reload, :logo_image)

      playlist.destroy!

      expect(File).not_to exist(Rails.root.join('public', 'uploads', 'test', 'private') + attacher.file.id)
      expect(File).not_to exist(Rails.root.join('public', 'uploads', 'test', 'public') + attacher.file.id)
    end

    it 'playlistが削除されても画像が消えること' do
      attacher = ImageUploader::Attacher.from_model(playlist.reload, :logo_image)

      playlist.destroy!

      expect(File.exist?(Rails.root.join('public', 'uploads', 'test', 'private') + attacher.file.id)).to be_falsey
      expect(File.exist?(Rails.root.join('public', 'uploads', 'test', 'public') + attacher.file.id)).to be_falsey
    end
  end
end
