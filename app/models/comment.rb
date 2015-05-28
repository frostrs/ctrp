# == Schema Information
#
# Table name: comments
#
#  id            :integer          not null, primary key
#  instance_uuid :string(255)
#  comment       :text
#  username      :string(255)
#  fullname      :string(255)
#  org           :string(255)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  uuid          :string(255)
#

class Comment < ActiveRecord::Base
  include BasicConcerns
end
