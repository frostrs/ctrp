json.extract! @trial, :id, :nci_id, :lead_protocol_id, :official_title, :pilot, :research_category_id,
              :primary_purpose_other, :secondary_purpose_other, :investigator_title, :program_code, :grant_question,
              :start_date, :start_date_qual, :primary_comp_date, :primary_comp_date_qual, :comp_date, :comp_date_qual,
              :ind_ide_question, :intervention_indicator, :sec801_indicator, :data_monitor_indicator, :history,
              :study_source_id, :phase_id, :primary_purpose_id, :secondary_purpose_id, :responsible_party_id,
              :accrual_disease_term_id, :lead_org_id, :pi_id, :sponsor_id, :investigator_id, :investigator_aff_id,
              :created_at, :updated_at, :created_by, :updated_by, :study_source, :lead_org, :pi, :sponsor,
              :investigator, :investigator_aff, :other_ids, :trial_funding_sources, :funding_sources, :grants,
              :trial_status_wrappers, :ind_ides, :oversight_authorities, :trial_documents, :is_draft, :lock_version,
              :actions, :research_category, :admin_checkout, :scientific_checkout, :process_priority, :process_comment, :nci_specific_comment,
              :nih_nci_div, :nih_nci_prog, :alternate_titles, :acronym, :keywords, :central_contacts, :board_name, :board_affiliation_id,
              :board_approval_num, :board_approval_status_id

json.trial_status_wrappers do
  json.array!(@trial.trial_status_wrappers) do |status|
    json.extract! status, :trial_id, :id, :status_date, :why_stopped, :trial_status_id, :trial_status, :comment, :created_at, :updated_at
  end
end

json.trial_documents do
  json.array!(@trial.trial_documents) do |document|
    json.extract! document, :id, :file, :file_name, :document_type, :document_subtype, :is_latest, :created_at, :updated_at
  end
end

json.collaborators do
  json.array!(@trial.collaborators) do |collaborator|
    json.extract! collaborator, :organization_id, :org_name
  end
end


## append the protocol_id_origin.name
unless @trial.other_ids.empty?
  oids_hash = []
  @trial.other_ids.each do |o|
    oid_hash = Hash.new
    oid_hash = {"name" => o.protocol_id_origin.name, "other_id_obj" => o}
    oids_hash << oid_hash
  end
  json.other_ids_hash oids_hash
end

json.submissions do
  json.array!(@trial.submissions) do |submission|
    json.extract! submission, :trial_id, :id, :submission_num, :submission_date, :amendment_num, :amendment_date,
                  :amendment_reason_id, :amendment_reason, :created_at, :updated_at, :user_id, :submission_source_id
  end
end

json.current_trial_status @trial.trial_status_wrappers.present? ?
    @trial.trial_status_wrappers.latest.trial_status.name : nil

json.current_trial_status_date @trial.trial_status_wrappers.present? ?
    @trial.trial_status_wrappers.latest.trial_status.updated_at : nil

json.processing_status @trial.processing_status_wrappers.present? ?
    @trial.processing_status_wrappers.latest.processing_status.name : nil

json.last_amendment_num @trial.milestone_wrappers.present? ?
    @trial.milestone_wrappers.last.submission.amendment_num : nil

json.last_amendment_date @trial.milestone_wrappers.present? ?
    @trial.milestone_wrappers.last.submission.amendment_date : nil

json.submission_method @trial.submissions.empty? ? '' : (@trial.submissions.last.submission_method.nil? ? '' : @trial.submissions.last.submission_method.name)

## get trial's last submitter
submitter = @trial.submissions.empty? ? nil : (@trial.submissions.last.user_id.nil? ? nil : @trial.submissions.last.user)

## submitter's username
json.submitter submitter.nil? ? '' : submitter.username

## get the submitter's organization name
json.submitters_organization submitter.nil? ? '' : (submitter.organization.nil? ? '' : submitter.organization.name)

## @trial.board_affiliation_id = 24068

json.board_affiliated_org @trial.board_affiliation_id.nil? ? nil : @trial.board_affiliation

json.last_submission_source @trial.submissions.empty? ? '' : (@trial.submissions.last.submission_source_id.nil? ? '' : SubmissionSource.find(@trial.submissions.last.submission_source_id))

json.sponsor_nci @trial.is_sponsor_nci?

send_trial_flag = @trial.set_send_trial_info_flag

json.send_trial_flag send_trial_flag ? "Yes":"No"

json.pa_editable @trial.pa_editable_check

json.internal_source @trial.internal_source_id.nil? ? nil : @trial.internal_source

#json.admin_checkout @trial.admin_checkout

#json.scientific_checkout @trial.scientific_checkout

#extract NCT Trial ID, if present
if @trial.other_ids.present?
  other_ids = @trial.other_ids
  nct_trial_id = nil

  other_ids.each do |o|
    name = o.protocol_id_origin.name
    unless name.nil?
      name.gsub!("Identifier", "")
      if name.downcase.include? "ClinicalTrials".downcase
        nct_trial_id = o.protocol_id
      end
    end
  end
  json.nct_trial_id nct_trial_id
end
