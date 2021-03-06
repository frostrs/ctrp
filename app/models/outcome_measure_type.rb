# == Schema Information
#
# Table name: outcome_measure_types
#
#  id           :integer          not null, primary key
#  code         :string(255)
#  name         :string(255)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  uuid         :string(255)
#  lock_version :integer          default(0)
#

class OutcomeMeasureType < ActiveRecord::Base
  include BasicConcerns
  validates :code, uniqueness: true

end
