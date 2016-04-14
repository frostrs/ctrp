# == Schema Information
#
# Table name: marker_biomarker_purpose_associations
#
#  id                   :integer          not null, primary key
#  marker_id            :integer
#  biomarker_purpose_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  uuid                 :string(255)
#  lock_version         :integer          default(0)
#

class MarkerBiomarkerPurposeAssociation < ActiveRecord::Base
  include BasicConcerns
  belongs_to  :marker
  belongs_to  :biomarker_purpose
end
