# == Schema Information
#
# Table name: markers
#
#  id                   :integer          not null, primary key
#  name                 :string(255)
#  record_status        :string(255)
#  evaluation_type_id   :integer
#  assay_type_id        :integer
#  biomarker_use_id     :integer
#  biomarker_purpose_id :integer
#  specimen_type_id     :integer
#  trial_id             :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  uuid                 :string(255)
#
# Indexes
#
#  index_markers_on_assay_type_id         (assay_type_id)
#  index_markers_on_biomarker_purpose_id  (biomarker_purpose_id)
#  index_markers_on_biomarker_use_id      (biomarker_use_id)
#  index_markers_on_evaluation_type_id    (evaluation_type_id)
#  index_markers_on_specimen_type_id      (specimen_type_id)
#  index_markers_on_trial_id              (trial_id)
#

require 'test_helper'

class MarkerTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
